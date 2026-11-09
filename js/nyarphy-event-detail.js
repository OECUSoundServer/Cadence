
(() => {
    "use strict";

    const root = new URL("../../", document.baseURI);
    const params = new URLSearchParams(location.search);
    const eventId = params.get("id");

    const $ = id => document.getElementById(id);

    let event = null;
    let detail = null;
    let works = [];

    const lang = () =>
        document.documentElement.lang === "en" ? "en" : "ja";

    const t = (ja, en) => lang() === "en" ? en : ja;

    function addText(parent, tag, value, className = "") {
        const element = document.createElement(tag);
        element.textContent = value;
        if (className) element.className = className;
        parent.append(element);
        return element;
    }

    function showSection(id, visible) {
        $(id).hidden = !visible;
    }

    function render() {
        if (!event) return;

        $("event-detail-title").textContent =
            event.eventName || "";

        $("event-detail-description").textContent =
            detail?.description?.[lang()] || "";

        document.title =
            `${event.eventName} | Nyarphy's Law`;

        // 開催情報
        const info = $("event-detail-info");
        info.replaceChildren();

        const fields = [
            [t("開催日", "Date"), event.date],
            [t("開催時間", "Time"), detail?.time],
            [t("会場", "Venue"), event.place],
            [t("サークル配置", "Booth"), event.booth]
        ];

        fields.forEach(([label, value]) => {
            if (!value) return;

            const row = document.createElement("div");
            addText(row, "dt", label);
            addText(row, "dd", value);
            info.append(row);
        });

        if (detail?.officialUrl) {
            const row = document.createElement("div");
            addText(row, "dt", t("公式サイト", "Official Site"));

            const dd = document.createElement("dd");
            const link = document.createElement("a");
            link.href = detail.officialUrl;
            link.textContent = t("公式サイトを見る", "Visit Official Site");
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            dd.append(link);
            row.append(dd);
            info.append(row);
        }

        // お品書き画像
        const menu = $("event-detail-menu");
        menu.replaceChildren();

        showSection("event-menu-section", !!detail?.menuImage);

        if (detail?.menuImage) {
            const link = document.createElement("a");
            link.href = new URL(detail.menuImage, root).href;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const img = document.createElement("img");
            img.src = link.href;
            img.alt = `${event.eventName} お品書き`;
            img.loading = "lazy";

            link.append(img);
            menu.append(link);
        }

        // 頒布作品
        const productList = $("event-detail-products");
        productList.replaceChildren();

        const products = detail?.products || [];
        showSection("event-products-section", products.length > 0);

        products.forEach(product => {
            const work = works.find(w => w.id === product.workId);
            if (!work) return;

            const card = document.createElement("a");
            card.className = "event-product-card";
            card.href = new URL(work.url, root).href;

            const img = document.createElement("img");
            img.src = new URL(work.image, root).href;
            img.alt = work.title;
            img.loading = "lazy";

            const body = document.createElement("div");

            addText(
                body, "span",
                product.type === "new"
                    ? t("新刊・新作", "New")
                    : t("既刊・既存作品", "Existing"),
                "event-product-type"
            );

            addText(body, "h3", work.title);

            if (product.price) {
                addText(body, "p", product.price);
            }

            card.append(img, body);
            productList.append(card);
        });

        // 注意事項
        const notices = detail?.notices?.[lang()] || [];
        const noticeList = $("event-detail-notices");
        noticeList.replaceChildren();

        showSection("event-notices-section", notices.length > 0);

        notices.forEach(note => {
            addText(noticeList, "li", note);
        });
    }

    async function load() {
        if (!eventId) {
            $("event-detail-title").textContent =
                "Event not specified";
            return;
        }

        try {
            const paths = [
                "data/events.json",
                "data/nyarphy-event-details.json",
                "data/nyarphy-works.json"
            ];

            const responses = await Promise.all(
                paths.map(path => fetch(new URL(path, root)))
            );

            if (responses.some(r => !r.ok)) {
                throw new Error("Failed to load event data");
            }

            const [eventsData, detailsData, worksData] =
                await Promise.all(responses.map(r => r.json()));

            event = eventsData[eventId];
            detail = detailsData[eventId] || {};
            works = worksData.works || [];

            if (!event || event.circle !== "nyarphy") {
                $("event-detail-title").textContent =
                    "Event not found";
                return;
            }

            render();

        } catch (error) {
            console.error(error);
            $("event-detail-title").textContent =
                "イベント情報を読み込めませんでした。";
        }
    }

    document.addEventListener("nyarphy:languagechange", render);

    load();
})();
