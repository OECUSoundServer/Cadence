
/* =========================================
   CIRCLE PORTAL
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initCircleLogos();
    initSlider();
    initNews();

});

/* =========================================
   CIRCLE LOGOS
   ========================================= */

/**
 * @fn    initCircleLogos
 * @brief ロゴ画像がない場合の代替表示
 */
function initCircleLogos() {

    document.querySelectorAll(".circle-logo").forEach(img => {

        const area = img.closest(".circle-logo-area");

        function showFallback() {
            area?.classList.add("no-image");
        }

        img.addEventListener("error", showFallback);

        if (img.complete && img.naturalWidth === 0) {
            showFallback();
        }
    });
}

/* =========================================
PICK UP SLIDER
========================================= */

/**
 * @fn    initSlider
 * @brief JSONからバナーを読み込み、スライダーを初期化
 */
async function initSlider() {

    const viewport = document.getElementById("slider-viewport");
    const dotsContainer = document.getElementById("slider-dots");
    const prevButton = document.getElementById("slider-prev");
    const nextButton = document.getElementById("slider-next");
    const slider = document.getElementById("pickup-slider");

    if (!viewport || !dotsContainer || !slider) return;

    let banners = [];

    try {
        const response = await fetch("data/banners.json");

        if (!response.ok) {
            throw new Error("バナーデータを取得できませんでした");
        }

        banners = await response.json();

        if (!Array.isArray(banners)) {
            throw new Error("バナーデータの形式が不正です");
        }

    } catch (error) {
        console.error(error);

        viewport.textContent = "バナーを読み込めませんでした。";
        return;
    }

    if (banners.length === 0) {
        viewport.textContent = "現在、注目のお知らせはありません。";
        prevButton.hidden = true;
        nextButton.hidden = true;
        return;
    }

    let currentIndex = 0;
    let timer = null;

    const slides = [];
    const dots = [];

    // バナーを生成
    banners.forEach((banner, index) => {

        const slide = document.createElement("div");
        slide.className = "slide";

        const link = document.createElement("a");
        link.className = "slide-link";
        link.href = banner.url || "#";
        link.setAttribute(
            "aria-label",
            banner.title || "お知らせを開く"
        );

        if (!banner.url) {
            link.removeAttribute("href");
        }

        const fallback = document.createElement("div");
        fallback.className = "slide-fallback";

        if (banner.circle === "nyarphy") {
            fallback.classList.add("nyarphy");
        } else if (banner.circle === "common") {
            fallback.classList.add("common");
        }

        const title = document.createElement("h3");
        title.textContent = banner.title || "";

        const description = document.createElement("p");
        description.textContent = banner.description || "";

        fallback.append(title, description);

        if (banner.image) {

            const img = document.createElement("img");
            img.className = "slide-image";
            img.alt = banner.title || "";
            img.src = banner.image;

            // バナー画像の表示位置
            const positions = ["top", "center", "bottom"];

            const position = positions.includes(banner.position)
                ? banner.position
                : "center";

            img.style.objectPosition = position;

            img.addEventListener("error", () => {
                img.replaceWith(fallback);
            });

            link.appendChild(img);

        } else {
            link.appendChild(fallback);
        }

        slide.appendChild(link);
        viewport.appendChild(slide);
        slides.push(slide);

        // ページ切り替えドット
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot";

        dot.setAttribute(
            "aria-label",
            `${index + 1}枚目のバナーを表示`
        );

        dot.addEventListener("click", () => {
            showSlide(index);
            restartTimer();
        });

        dotsContainer.appendChild(dot);
        dots.push(dot);
    });

    /**
     * @fn    showSlide
     * @brief 指定したスライドを表示
     * @param index 表示するスライド番号
     */
    function showSlide(index) {

        currentIndex = (
            index + slides.length
        ) % slides.length;

        slides.forEach((slide, i) => {

            const active = i === currentIndex;

            slide.classList.toggle("active", active);
            slide.setAttribute("aria-hidden", String(!active));

            // 非表示スライドのリンクにフォーカスさせない
            const link = slide.querySelector(".slide-link");

            if (link) {
                if (active && link.hasAttribute("href")) {
                    link.removeAttribute("tabindex");
                } else {
                    link.setAttribute("tabindex", "-1");
                }
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
            dot.setAttribute(
                "aria-current",
                i === currentIndex ? "true" : "false"
            );
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function stopTimer() {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }

    function startTimer() {
        stopTimer();

        if (
            slides.length <= 1 ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        timer = setInterval(nextSlide, 5000);
    }

    function restartTimer() {
        startTimer();
    }

    prevButton.addEventListener("click", () => {
        prevSlide();
        restartTimer();
    });

    nextButton.addEventListener("click", () => {
        nextSlide();
        restartTimer();
    });

    // マウスを乗せている間は自動再生を停止
    slider.addEventListener("mouseenter", stopTimer);
    slider.addEventListener("mouseleave", startTimer);

    // キーボード操作中も自動再生を停止
    slider.addEventListener("focusin", stopTimer);
    slider.addEventListener("focusout", event => {
        if (!slider.contains(event.relatedTarget)) {
            startTimer();
        }
    });

    // 非表示タブでは自動再生を停止
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    // 1枚だけなら操作ボタンを非表示
    if (slides.length <= 1) {
        prevButton.hidden = true;
        nextButton.hidden = true;
        dotsContainer.hidden = true;
    }

    showSlide(0);
    startTimer();
}

/* =========================================
   NEWS
   ========================================= */

/**
 * @fn    initNews
 * @brief ニュース一覧の読み込みとフィルター処理
 */
async function initNews() {

    const list = document.getElementById("news-list");
    const moreButton = document.getElementById("news-more-button");
    const filterButtons = document.querySelectorAll(".filter-button");

    if (!list || !moreButton) return;

    let news = [];
    let currentFilter = "all";
    let visibleCount = 4;

    try {
        const response = await fetch("data/news.json");

        if (!response.ok) {
            throw new Error("ニュースを取得できませんでした");
        }

        news = await response.json();

        if (!Array.isArray(news)) {
            throw new Error("ニュースの形式が不正です");
        }

        // 日付の新しい順に並べ替え
        news.sort((a, b) => {
            return String(b.date).localeCompare(String(a.date));
        });

    } catch (error) {
        console.error(error);

        list.textContent = "お知らせを読み込めませんでした。";
        return;
    }

    /**
     * @fn    renderNews
     * @brief フィルター条件に従ってニュースを描画
     */
    function renderNews() {

        list.replaceChildren();

        const filtered = news.filter(item => {
            return currentFilter === "all" ||
                   item.circle === currentFilter;
        });

        const visible = filtered.slice(0, visibleCount);

        if (visible.length === 0) {

            const empty = document.createElement("p");
            empty.className = "empty-message";
            empty.textContent = "該当するお知らせはありません。";

            list.appendChild(empty);
        }

        visible.forEach(item => {

            const article = document.createElement("article");
            article.className = "news-item";

            const meta = document.createElement("div");
            meta.className = "news-meta";

            const date = document.createElement("time");
            date.className = "news-date";
            date.dateTime = item.date || "";
            date.textContent = (item.date || "").replaceAll("-", ".");

            const circle = document.createElement("span");
            circle.className = "news-circle";

            const circleNames = {
                cadence: "Cadence",
                nyarphy: "にゃーふぃの法則",
                common: "共通"
            };

            circle.textContent =
                circleNames[item.circle] || "お知らせ";

            if (item.circle === "cadence" || item.circle === "nyarphy") {
                circle.classList.add(item.circle);
            }

            const category = document.createElement("span");
            category.className = "news-category";
            category.textContent = item.category || "";

            meta.append(date, circle, category);

            const title = document.createElement("h3");
            title.className = "news-title";

            if (item.url) {

                const link = document.createElement("a");
                link.href = item.url;
                link.textContent = item.title || "";

                title.appendChild(link);

            } else {
                title.textContent = item.title || "";
            }

            article.append(meta, title);
            list.appendChild(article);
        });

        // もっと見るボタン
        moreButton.hidden = filtered.length <= visibleCount;

        moreButton.textContent = "もっと見る ↓";
    }

    // フィルターボタン
    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            currentFilter = button.dataset.filter || "all";
            visibleCount = 4;

            filterButtons.forEach(btn => {

                const active = btn === button;

                btn.classList.toggle("active", active);
                btn.setAttribute("aria-pressed", String(active));
            });

            renderNews();
        });
    });

    // もっと見る
    moreButton.addEventListener("click", () => {
        visibleCount += 4;
        renderNews();
    });

    renderNews();
}
