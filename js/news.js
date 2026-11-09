
/* =========================================
   共通ニュース表示システム

   ・new.html からニュースを取得
   ・サークル別フィルター
   ・日付の新しい順に並び替え
   ・トップページでは最新5件
   ・一覧ページでは全件表示
   ・もっと見るで別ページへ移動
   ========================================= */

document.addEventListener("DOMContentLoaded", initNews);

/**
 * @fn    initNews
 * @brief 共通ニュースHTMLの読み込みと表示
 */
async function initNews() {

    const container = document.getElementById("news-list");

    if (!container) {
        return;
    }

    // =========================================
    // 1. 設定
    // =========================================

    // all / cadence / nyarphy
    const defaultCircle =
        container.dataset.newsCircle || "all";

    // ニュースデータの場所
    const source =
        container.dataset.newsSource || "new.html";

    // リポジトリルートへの相対パス
    const root =
        container.dataset.newsRoot || "./";

    const rootURL = new URL(root, document.baseURI);

    // 一覧ページかどうか
    const showAll =
        container.dataset.newsShowAll === "true";

    // もっと見るの遷移先
    const moreURL = new URL("news.html", rootURL);

    // もっと見る要素
    const moreButton =
        document.getElementById("news-more-button");

    // フィルターボタン
    const filterButtons =
        document.querySelectorAll("[data-news-filter]");

    // トップページの表示件数
    const pageSize = 5;

    // ニュースデータ
    let allNews = [];

    // 現在のフィルター
    let currentCircle = defaultCircle;

    // =========================================
    // 2. URLパラメータの取得
    // =========================================

    const params = new URLSearchParams(
        window.location.search
    );

    const requestedCircle = params.get("circle");

    const validCircles = [
        "all",
        "cadence",
        "nyarphy"
    ];

    if (validCircles.includes(requestedCircle)) {
        currentCircle = requestedCircle;
    }

    // =========================================
    // 3. ニュースデータの取得
    // =========================================

    try {

        const newsURL = new URL(
            source,
            document.baseURI
        );

        console.log(
            "[NEWS] 読み込み先:",
            newsURL.href
        );

        const response = await fetch(newsURL);

        if (!response.ok) {

            throw new Error(
                `ニュース取得エラー: HTTP ${response.status}`
            );
        }

        const html = await response.text();

        const parser = new DOMParser();

        const doc = parser.parseFromString(
            html,
            "text/html"
        );

        // new.html の #news-data から取得
        allNews = Array.from(
            doc.querySelectorAll(
                "#news-data > p[data-circle]"
            )
        );

        console.log(
            "[NEWS] 取得件数:",
            allNews.length
        );

        if (allNews.length === 0) {

            console.warn(
                "[NEWS] ニュースが0件です。" +
                "new.html の data-circle を確認してください。"
            );
        }

        // =====================================
        // 4. ニュース内リンクの補正
        // =====================================

        allNews.forEach(item => {

            const links =
                item.querySelectorAll("a[href]");

            links.forEach(link => {

                const href =
                    link.getAttribute("href");

                if (!href) {
                    return;
                }

                // ページ内リンクはそのまま
                if (href.startsWith("#")) {
                    return;
                }

                // 外部URL・mailtoなどはそのまま
                if (
                    href.startsWith("//") ||
                    /^[a-z][a-z0-9+.-]*:/i.test(href)
                ) {
                    return;
                }

                // リポジトリルートを基準に補正
                link.href = new URL(
                    href,
                    rootURL
                ).href;
            });
        });

        // =====================================
        // 5. 日付の新しい順に並び替え
        // =====================================

        allNews.sort((a, b) => {

            const dateA =
                a.dataset.date || "";

            const dateB =
                b.dataset.date || "";

            return dateB.localeCompare(dateA);
        });

    } catch (error) {

        console.error(
            "[NEWS] 読み込み失敗:",
            error
        );

        container.textContent =
            "ニュースを読み込めませんでした。";

        if (moreButton) {
            moreButton.hidden = true;
        }

        return;
    }

    // =========================================
    // 6. フィルターの選択状態
    // =========================================

    /**
     * @fn    updateFilterButtons
     * @brief フィルターボタンの状態を更新
     */
    function updateFilterButtons() {

        filterButtons.forEach(button => {

            const active =
                button.dataset.newsFilter ===
                currentCircle;

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });
    }

    // =========================================
    // 7. ニュースの描画
    // =========================================

    /**
     * @fn    renderNews
     * @brief 条件に一致するニュースを描画
     */
    function renderNews() {

        // 前回の内容を削除
        container.replaceChildren();

        // -------------------------------------
        // サークル別に絞り込み
        // -------------------------------------

        const filtered = allNews.filter(item => {

            const circle =
                item.dataset.circle;

            // すべて表示
            if (currentCircle === "all") {
                return true;
            }

            // 選択サークルと共通ニュース
            return (
                circle === currentCircle ||
                circle === "common"
            );
        });

        // -------------------------------------
        // 表示件数の制御
        // -------------------------------------

        // 一覧ページなら全件
        // それ以外は最新5件
        const visible = showAll
            ? filtered
            : filtered.slice(0, pageSize);

        // -------------------------------------
        // ニュースがない場合
        // -------------------------------------

        if (visible.length === 0) {

            const message =
                document.createElement("p");

            message.className =
                "empty-message";

            message.textContent =
                "現在、お知らせはありません。";

            container.appendChild(message);
        }

        // -------------------------------------
        // ニュースを生成
        // -------------------------------------

        visible.forEach(item => {

            const article =
                document.createElement("article");

            article.className =
                "news-item";

            // =================================
            // 日付
            // =================================

            const date =
                document.createElement("time");

            date.className =
                "news-date";

            const dateValue =
                item.dataset.date || "";

            date.dateTime = dateValue;

            date.textContent =
                dateValue.replaceAll("-", "/");

            // =================================
            // サークルタグ
            // =================================

            const badge =
                document.createElement("span");

            badge.className =
                "news-circle";

            const circle =
                item.dataset.circle;

            const circleNames = {
                cadence: "Cadence",
                nyarphy: "にゃーふぃーの法則",
                common: "共通"
            };

            badge.textContent =
                circleNames[circle] || circle;

            if (
                circle === "cadence" ||
                circle === "nyarphy" ||
                circle === "common"
            ) {
                badge.classList.add(circle);
            }

            // =================================
            // 本文
            // =================================

            const body =
                document.createElement("div");

            body.className =
                "news-body";

            // 元のp要素を複製
            const content =
                item.cloneNode(true);

            // 本文先頭の日付を取り除く
            const firstText = Array.from(
                content.childNodes
            ).find(node => {

                return (
                    node.nodeType === Node.TEXT_NODE &&
                    node.textContent.trim() !== ""
                );
            });

            if (firstText) {

                firstText.textContent =
                    firstText.textContent.replace(
                        /^\s*\d{4}\/\d{2}\/\d{2}\s*/,
                        ""
                    );
            }

            // リンクを維持して本文を移動
            while (content.firstChild) {

                body.appendChild(
                    content.firstChild
                );
            }

            // =================================
            // メタ情報
            // =================================

            const meta =
                document.createElement("div");

            meta.className =
                "news-meta";

            meta.appendChild(date);
            meta.appendChild(badge);

            // =================================
            // 記事を組み立て
            // =================================

            article.appendChild(meta);
            article.appendChild(body);

            container.appendChild(article);
        });

        // =====================================
        // もっと見るリンク
        // =====================================

        if (moreButton) {

            // 一覧ページでは非表示
            if (showAll) {

                moreButton.hidden = true;

            } else {

                // フィルター条件に応じたURL
                const target = new URL(
                    moreURL.href
                );

                if (currentCircle !== "all") {

                    target.searchParams.set(
                        "circle",
                        currentCircle
                    );
                }

                // a要素ならhrefを設定
                if (
                    moreButton.tagName.toLowerCase()
                    === "a"
                ) {

                    moreButton.href = target.href;
                }

                // ボタン要素でも動くようにする
                moreButton.dataset.targetURL =
                    target.href;

                // 5件より多い場合のみ表示
                moreButton.hidden =
                    filtered.length <= pageSize;
            }
        }
    }

    // =========================================
    // 8. フィルターボタン
    // =========================================

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentCircle =
                    button.dataset.newsFilter || "all";

                updateFilterButtons();
                renderNews();
            }
        );
    });

    // =========================================
    // 9. もっと見るボタン
    // =========================================

    if (
        moreButton &&
        moreButton.tagName.toLowerCase() === "button"
    ) {

        moreButton.addEventListener(
            "click",
            () => {

                const target =
                    moreButton.dataset.targetURL;

                if (target) {
                    window.location.href = target;
                }
            }
        );
    }

    // =========================================
    // 10. 初回表示
    // =========================================

    updateFilterButtons();

    renderNews();

    console.log(
        "[NEWS] 初期表示完了",
        {
            circle: currentCircle,
            showAll: showAll
        }
    );
}
