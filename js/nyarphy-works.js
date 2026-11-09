
/* ======================================
   NYARPHY WORKS
   ====================================== */

(() => {
    const container = document.getElementById("works-list");

    if (!container) return;

    const root = container.dataset.worksRoot || "../";
    const limit = Number(container.dataset.worksLimit || 0);
    const layout = container.dataset.worksLayout || "grid";

    let works = [];

    /* --------------------------------------
       LANGUAGE
       -------------------------------------- */

    function getLanguage() {
        return document.documentElement.lang === "en"
            ? "en"
            : "ja";
    }

    function translate(ja, en) {
        return getLanguage() === "en" ? en : ja;
    }

    /* --------------------------------------
       ELEMENT HELPER
       -------------------------------------- */

    function createElement(tag, className = "", text = null) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== null) {
            element.textContent = text;
        }

        return element;
    }

    function createCover(work, className) {
        const link = createElement("a", className);
        link.href = root + work.url;

        if (work.image) {
            const img = document.createElement("img");

            img.src = root + work.image;
            img.alt = work.title;
            img.loading = "lazy";

            link.appendChild(img);
        } else {
            link.appendChild(
                createElement("span", "", "NO IMAGE")
            );
        }

        return link;
    }

    /* --------------------------------------
       GRID CARD
       -------------------------------------- */

    function createGridCard(work) {
        const article = createElement("article", "work-card");

        const link = createElement("a", "work-link");
        link.href = root + work.url;

        const cover = createElement("div", "work-cover");

        if (work.image) {
            const img = document.createElement("img");

            img.src = root + work.image;
            img.alt = work.title;
            img.loading = "lazy";

            cover.appendChild(img);
        }

        const body = createElement("div", "work-body");

        body.appendChild(
            createElement("span", "work-category", work.category)
        );

        body.appendChild(
            createElement("h3", "", work.title)
        );

        body.appendChild(
            createElement(
                "p",
                "",
                work.description?.[getLanguage()] ||
                work.description?.ja ||
                ""
            )
        );

        const meta = createElement("div", "work-meta");

        meta.appendChild(
            createElement("span", "", work.id)
        );

        meta.appendChild(
            createElement("span", "", work.circle)
        );

        body.appendChild(meta);

        link.append(cover, body);
        article.appendChild(link);

        return article;
    }

    /* --------------------------------------
       LIST CARD
       -------------------------------------- */

    function createListCard(work) {
        const article = createElement(
            "article",
            "works-list-item"
        );

        const cover = createCover(
            work,
            "works-list-cover"
        );

        const content = createElement(
            "div",
            "works-list-content"
        );

        const category = createElement(
            "span",
            "works-list-category",
            work.category
        );

        const title = createElement(
            "h2",
            "works-list-title"
        );

        const titleLink = createElement(
            "a",
            "",
            work.title
        );

        titleLink.href = root + work.url;
        title.appendChild(titleLink);

        const description = createElement(
            "p",
            "works-list-description",
            work.description?.[getLanguage()] ||
            work.description?.ja ||
            ""
        );

        const meta = createElement(
            "div",
            "works-list-meta"
        );

        meta.appendChild(
            createElement("span", "", work.id)
        );

        meta.appendChild(
            createElement("span", "", work.circle)
        );

        if (work.spec) {
            meta.appendChild(
                createElement("span", "", work.spec)
            );
        }

        const detail = createElement(
            "a",
            "works-list-detail",
            translate("作品の詳細を見る", "View Details")
        );

        detail.href = root + work.url;

        content.append(
            category,
            title,
            description,
            meta,
            detail
        );

        article.append(cover, content);

        return article;
    }

    /* --------------------------------------
       RENDER
       -------------------------------------- */

    function renderWorks() {
        container.replaceChildren();

        const displayedWorks =
            limit > 0 ? works.slice(0, limit) : works;

        displayedWorks.forEach(work => {
            const element = layout === "list"
                ? createListCard(work)
                : createGridCard(work);

            container.appendChild(element);
        });
    }

    /* --------------------------------------
       LOAD JSON
       -------------------------------------- */

    async function loadWorks() {
        try {
            const response = await fetch(
                root + "data/nyarphy-works.json"
            );

            if (!response.ok) {
                throw new Error("Failed to load works");
            }

            const data = await response.json();

            works = data.works
                .filter(work => work.date)
                .sort((a, b) =>
                    b.date.localeCompare(a.date)
                );

            renderWorks();

        } catch (error) {
            console.error("Works loading error:", error);

            container.textContent =
                translate(
                    "作品情報を読み込めませんでした。",
                    "Failed to load works."
                );
        }
    }

    /* --------------------------------------
       INITIALIZE
       -------------------------------------- */

    document.addEventListener("DOMContentLoaded", () => {

        loadWorks();

        document.querySelectorAll(".lang-button")
            .forEach(button => {
                button.addEventListener("click", () => {
                    queueMicrotask(renderWorks);
                });
            });

    });

})();
