
(() => {
    "use strict";

    const container = document.getElementById("nyarphy-events-list");
    if (!container) return;

    const source = container.dataset.eventsSource;
    const targetCircle = container.dataset.eventsCircle || "nyarphy";

    let events = [];

    function getLanguage() {
        return document.documentElement.lang === "en" ? "en" : "ja";
    }

    function translate(ja, en) {
        return getLanguage() === "en" ? en : ja;
    }

    function parseDate(value) {
        // YYYY/MM/DD または YYYY-MM-DD に対応
        const match = String(value || "")
            .match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);

        if (!match) return null;

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);

        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return date;
    }

    function isUpcoming(event) {
        const date = parseDate(event.date);
        if (!date) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return date >= today;
    }

    function createInfo(iconClass, value) {
        const row = document.createElement("div");
        row.className = "nyarphy-event-info";

        const icon = document.createElement("i");
        icon.className = iconClass;
        icon.setAttribute("aria-hidden", "true");

        const text = document.createElement("span");
        text.textContent = value;

        row.append(icon, text);
        return row;
    }

    function createEventCard(event) {
        const card = document.createElement("article");
        card.className = "nyarphy-event-card";

        const date = parseDate(event.date);

        // 左側：日付
        const dateArea = document.createElement("div");
        dateArea.className = "nyarphy-event-date";

        if (date) {
            const month = document.createElement("span");
            month.className = "nyarphy-event-month";
            month.textContent = `${date.getMonth() + 1}月`;

            const day = document.createElement("strong");
            day.className = "nyarphy-event-day";
            day.textContent = date.getDate();

            const year = document.createElement("span");
            year.className = "nyarphy-event-year";
            year.textContent = date.getFullYear();

            dateArea.append(month, day, year);
        } else {
            dateArea.textContent = event.date || "";
        }

        // 中央：イベント情報
        const content = document.createElement("div");
        content.className = "nyarphy-event-content";

        const circle = document.createElement("span");
        circle.className = "nyarphy-event-circle";
        circle.textContent = "にゃーふぃーの法則";

        const title = document.createElement("h3");
        title.className = "nyarphy-event-title";
        title.textContent = event.eventName || "";

        content.append(circle, title);

        if (event.place) {
            const place = document.createElement("p");
            place.className = "nyarphy-event-place";
            place.textContent = `⚑ ${event.place}`;
            content.append(place);
        }

        if (event.booth) {
            const booth = document.createElement("p");
            booth.className = "nyarphy-event-booth";
            booth.textContent = `◆ ${event.booth}`;
            content.append(booth);
        }

        if (event.note) {
            const note = document.createElement("p");
            note.className = "nyarphy-event-note";
            note.textContent = event.note;
            content.append(note);
        }

        card.append(dateArea, content);

        // 右上：詳細リンク
        if (event.url) {
            const link = document.createElement("a");
            link.className = "nyarphy-event-arrow";
            link.href = event.url;
            link.setAttribute(
                "aria-label",
                `${event.eventName} の詳細を見る`
            );
            link.textContent = "↗";
            card.append(link);
        }

        return card;
    }


    function render() {
        container.replaceChildren();

        if (events.length === 0) {
            const message = document.createElement("p");
            message.className = "event-empty";
            message.textContent = translate(
                "イベント参加情報は準備中です。",
                "Event information is coming soon."
            );
            container.append(message);
            return;
        }

        events.forEach(event => {
            container.append(createEventCard(event));
        });
    }

    async function loadEvents() {
        try {
            const response = await fetch(source);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            events = Object.entries(data)
                .map(([id, event]) => ({
                    id,
                    ...event
                }))
                .filter(event => {
                    const circle = event.circle || "cadence";
                    return circle === targetCircle;
                })
                .sort((a, b) => {
                    const dateA = parseDate(a.date)?.getTime() || 0;
                    const dateB = parseDate(b.date)?.getTime() || 0;
                    return dateB - dateA;
                });

            render();

        } catch (error) {
            console.error("Failed to load events:", error);
            render();
        }
    }

    // 言語切り替え後に再描画
    document.querySelectorAll("[data-lang]").forEach(button => {
        button.addEventListener("click", () => {
            queueMicrotask(render);
        });
    });

    loadEvents();
})();
