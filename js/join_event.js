document.addEventListener("DOMContentLoaded", initEvents);

async function initEvents() {
    const container = document.getElementById("event-list");
    if (!container) return;

    const source = container.dataset.eventSource;
    const root = container.dataset.eventRoot || "./";
    const limit = Number(container.dataset.eventLimit || 5);

    const rootURL = new URL(root, document.baseURI);

    const circleNames = {
        cadence: "Cadence",
        nyarphy: "にゃーふぃの法則",
        common: "共通"
    };

    // circle未設定・空欄はCadence
    function getCircle(value) {
        const circle = String(value || "").trim().toLowerCase();
        return Object.hasOwn(circleNames, circle) ? circle : "cadence";
    }

    // 開催日を解析
    function parseDate(value) {
        const match = String(value || "").match(
            /^(\d{4})[/-](\d{2})[/-](\d{2})/
        );

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

    // 複数日開催の場合は最終日を取得
    function getEndDate(event) {
        if (event.endDate) {
            return parseDate(event.endDate);
        }

        const dateText = String(event.date || "");
        const start = parseDate(dateText);

        if (!start) return null;

        // 例: 2023/12/02 ~ 12/03
        const match = dateText.match(
            /[~～]\s*(?:(\d{4})[/-])?(\d{2})[/-](\d{2})/
        );

        if (!match) return start;

        const year = match[1]
            ? Number(match[1])
            : start.getFullYear();

        const end = new Date(
            year,
            Number(match[2]) - 1,
            Number(match[3])
        );

        return end >= start ? end : start;
    }

    function getEventURL(id, event) {
        if (event.url) {
            return new URL(event.url, rootURL).href;
        }

        return new URL(
            `event/e.html?e=${encodeURIComponent(id)}`,
            rootURL
        ).href;
    }

    try {
        const response = await fetch(source);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const events = Object.entries(data)
            .map(([id, event]) => ({
                id,
                ...event,
                circle: getCircle(event.circle),
                startDate: parseDate(event.date),
                endDate: getEndDate(event)
            }))
            .filter(event =>
                event.startDate &&
                event.endDate &&
                event.endDate >= today &&
                event.showOnPortal !== false
            )
            .sort((a, b) => a.startDate - b.startDate)
            .slice(0, limit);

        container.replaceChildren();

        if (events.length === 0) {
            const empty = document.createElement("p");
            empty.className = "event-empty";
            empty.textContent =
                "現在、参加予定のイベントはありません。";

            container.appendChild(empty);
            return;
        }

        events.forEach(event => {

            const card = document.createElement("a");
            card.className = `event-card event-card-${event.circle}`;
            card.href = getEventURL(event.id, event);

            // 日付
            const dateBox = document.createElement("div");
            dateBox.className = "event-date-box";

            const month = document.createElement("span");
            month.className = "event-month";
            month.textContent = String(
                event.startDate.getMonth() + 1
            ).padStart(2, "0") + "月";

            const day = document.createElement("strong");
            day.className = "event-day";
            day.textContent = event.startDate.getDate();

            const year = document.createElement("span");
            year.className = "event-year";
            year.textContent = event.startDate.getFullYear();

            dateBox.append(month, day, year);

            // イベント情報
            const content = document.createElement("div");
            content.className = "event-content";

            const circle = document.createElement("span");
            circle.className = `event-circle ${event.circle}`;
            circle.textContent = circleNames[event.circle];

            const title = document.createElement("h3");
            title.textContent = event.eventName || event.id;

            content.append(circle, title);

            if (event.place) {
                const place = document.createElement("p");
                place.className = "event-place";
                place.textContent = `⌖ ${event.place}`;
                content.appendChild(place);
            }

            if (event.booth) {
                const booth = document.createElement("p");
                booth.className = "event-booth";
                booth.textContent = `🎟 ${event.booth}`;
                content.appendChild(booth);
            }

            const arrow = document.createElement("span");
            arrow.className = "event-card-arrow";
            arrow.textContent = "↗";
            arrow.setAttribute("aria-hidden", "true");

            card.append(dateBox, content, arrow);
            container.appendChild(card);

        });

    } catch (error) {
        console.error("イベント情報の読み込みに失敗:", error);
        container.textContent =
            "イベント情報を読み込めませんでした。";
    }
}
