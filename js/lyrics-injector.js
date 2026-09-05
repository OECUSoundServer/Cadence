/**
 * lyrics-injector.js
 *
 * 共通歌詞ページ用
 *
 * URL例:
 *   l.html?s=yuyake
 *
 * データ:
 *   ./data/songs.json
 *
 * 歌詞:
 *   ./data/lyrics/xxx-ja.txt
 */


document.addEventListener("DOMContentLoaded", async () => {

    // =========================================================
    // URLから曲ID取得
    // =========================================================

    const params = new URLSearchParams(window.location.search);
    const songId = params.get("s");

    if (!songId) {
        showError("曲が指定されていません。");
        return;
    }


    try {

        // =====================================================
        // songs.json 読み込み
        // =====================================================

        const songs = await loadSongs();

        const song = songs[songId];

        if (!song) {
            showError(`曲「${songId}」が見つかりませんでした。`);
            return;
        }


        // =====================================================
        // ページ生成
        // =====================================================

        await renderSong(song);

    } catch (error) {

        console.error("曲データ読み込み失敗:", error);

        showError(
            "曲データを読み込めませんでした。"
        );
    }

});



/* ============================================================
   songs.json 読み込み
============================================================ */

async function loadSongs() {

    const response = await fetch("./songs.json", {
        cache: "no-store"
    });

    if (!response.ok) {

        throw new Error(
            `songs.json の読み込みに失敗しました: HTTP ${response.status}`
        );
    }

    return await response.json();
}



/* ============================================================
   曲ページ生成
============================================================ */
async function renderSong(song) {

    // =========================================================
    // ページ公開日時
    // =========================================================

    if (song.publish?.page) {

        const publishDate =
            new Date(song.publish.page);

        const now =
            new Date();

        if (now < publishDate) {

            setText(
                "song-title",
                song.title ?? "未公開"
            );

            showLyricsMessage(
                `このページは ${formatDateTime(publishDate)} に公開予定です。`
            );

            return;
        }
    }


    // =========================================================
    // 基本情報
    // =========================================================

    setText(
        "song-title",
        song.title
    );


    // ---------------------------------------------------------
    // 作曲
    // ---------------------------------------------------------

    const composerRow =
        document.getElementById(
            "song-composer-row"
        );

    if (song.composer) {

        setText(
            "song-composer",
            joinNames(song.composer)
        );

        if (composerRow) {
            composerRow.hidden = false;
        }

    } else {

        if (composerRow) {
            composerRow.hidden = true;
        }
    }


    // ---------------------------------------------------------
    // 編曲
    // ---------------------------------------------------------

    setText(
        "song-arranger",
        joinNames(song.arranger)
    );


    // ---------------------------------------------------------
    // 作詞
    // ---------------------------------------------------------

    setText(
        "song-lyricist",
        joinNames(song.lyricist)
    );


    // ---------------------------------------------------------
    // ボーカル
    // ---------------------------------------------------------

    setText(
        "song-vocal",
        joinNames(song.vocal)
    );


    document.title =
        `Cadence｜${song.title}`;


    // =========================================================
    // Release情報
    // =========================================================

    if (song.release) {

        renderSongReleaseInfo(
            song,
            song.release
        );

        renderRelease(
            song,
            song.release
        );

    } else {

        setText(
            "song-release",
            song.releaseText ?? "-"
        );

        setText(
            "song-published",
            song.published ?? "-"
        );


        const section =
            document.getElementById(
                "release"
            );

        if (section) {
            section.hidden = true;
        }
    }


    // =========================================================
    // OGP / SNS共有
    // =========================================================

    updatePageMeta(song);


    // =========================================================
    // 動画
    // =========================================================

    setupVideo(
        song.video
    );


    // =========================================================
    // 言語
    // =========================================================

    const availableLanguages =
        getAvailableLanguages(
            song.languages
        );


    if (availableLanguages.length === 0) {

        showLyricsMessage(
            "現在公開されている歌詞はありません。"
        );

        return;
    }


    createLanguageButtons(
        song,
        availableLanguages
    );


    // =========================================================
    // 初期表示言語
    // =========================================================

    const defaultLang =
        availableLanguages.includes("ja")
            ? "ja"
            : availableLanguages[0];


    await loadLyrics(
        song,
        defaultLang
    );
}

/* ============================================================
   上部のRelease情報
============================================================ */

function renderSongReleaseInfo(
    song,
    release
) {

    // ---------------------------------------------------------
    // 収録
    // ---------------------------------------------------------

    let releaseText = "";


    if (release.catalog) {

        releaseText +=
            release.catalog;
    }


    if (release.title) {

        releaseText +=
            `${releaseText ? " " : ""}「${release.title}」`;
    }


    setText(
        "song-release",
        releaseText || "-"
    );


    // ---------------------------------------------------------
    // 発表
    // ---------------------------------------------------------

    let published = "";


    if (release.event) {

        published +=
            release.event;
    }


    if (release.date) {

        const date =
            new Date(release.date);

        const year =
            date.getFullYear();


        if (!Number.isNaN(year)) {

            published +=
                `${published ? " " : ""}（${year}年）`;
        }
    }


    setText(
        "song-published",
        published || "-"
    );
}



/* ============================================================
   歌詞読み込み
============================================================ */

async function loadLyrics(
    song,
    lang
) {

    const language =
        song.languages?.[lang];


    if (!language) {
        return;
    }


    setActiveLanguage(
        lang
    );


    const lyricsElement =
        document.getElementById(
            "lyrics-text"
        );


    if (!lyricsElement) {
        return;
    }


    const message =
        document.getElementById(
            "lyrics-message"
        );


    // メッセージ初期化
    if (message) {

        message.hidden = true;
        message.textContent = "";
    }


    // 歌詞初期化
    lyricsElement.innerHTML = "";
    lyricsElement.lang = lang;
    lyricsElement.dataset.lang = lang;


    // =========================================================
    // 言語別公開日時
    // =========================================================

    if (language.publish) {

        const publishDate =
            new Date(language.publish);


        if (new Date() < publishDate) {

            showLyricsMessage(
                `${language.name ?? lang}版は ` +
                `${formatDateTime(publishDate)} に公開予定です。`
            );

            return;
        }
    }


    // =========================================================
    // 歌詞ファイル確認
    // =========================================================

    if (!language.file) {

        showLyricsMessage(
            "歌詞ファイルが設定されていません。"
        );

        return;
    }


    try {

        // =====================================================
        // TXT読み込み
        // =====================================================

        const response =
            await fetch(
                language.file,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const text =
            await response.text();


        // =====================================================
        // プレビュー制御
        // =====================================================

        const processed =
            processPreview(
                text,
                song,
                language
            );


        // =====================================================
        // HTMLへ変換
        // =====================================================

        lyricsElement.innerHTML =
            convertLyricsToHTML(
                processed.text
            );


        // =====================================================
        // プレビュー表示
        // =====================================================

        if (processed.isPreview) {

            const cut =
                document.createElement(
                    "div"
                );

            cut.className =
                "lyrics-cut";


            lyricsElement.appendChild(
                cut
            );


            const notice =
                document.createElement(
                    "p"
                );

            notice.className =
                "lyrics-preview-notice";

            notice.textContent =
                "歌詞の続きは公開日以降に表示されます。";


            lyricsElement.appendChild(
                notice
            );
        }


    } catch (error) {

        console.error(
            "歌詞読み込み失敗:",
            error
        );


        showLyricsMessage(
            "歌詞を読み込めませんでした。"
        );
    }
}



/* ============================================================
   プレビュー処理
============================================================ */

function processPreview(
    text,
    song,
    language
) {

    // 改行コード統一
    text =
        text.replace(
            /\r\n?/g,
            "\n"
        );


    // [preview-end] 行
    const markerRegex =
        /^[ \t]*\[preview-end\][ \t]*$/m;


    const match =
        text.match(
            markerRegex
        );


    // マーカーなし
    if (!match) {

        return {
            text,
            isPreview: false
        };
    }


    // =========================================================
    // 全文公開日時
    // =========================================================

    const fullPublish =
        language.fullPublish ??
        song.publish?.fullLyrics;


    // =========================================================
    // 全文公開日時なし
    // =========================================================

    if (!fullPublish) {

        return {

            text:
                removePreviewMarker(
                    text
                ),

            isPreview:
                false
        };
    }


    const now =
        new Date();


    const unlock =
        new Date(
            fullPublish
        );


    // =========================================================
    // 全文公開済み
    // =========================================================

    if (now >= unlock) {

        return {

            text:
                removePreviewMarker(
                    text
                ),

            isPreview:
                false
        };
    }


    // =========================================================
    // プレビュー期間
    // =========================================================

    const markerIndex =
        match.index;


    let previewText =
        text.substring(
            0,
            markerIndex
        );


    // 最後の余分な改行を除去
    previewText =
        previewText.replace(
            /\n+$/,
            ""
        );


    return {

        text:
            previewText,

        isPreview:
            true
    };
}



/* ============================================================
   [preview-end] 削除
============================================================ */

function removePreviewMarker(
    text
) {

    return text

        .replace(
            /\n?[ \t]*\[preview-end\][ \t]*\n?/,
            "\n"
        )

        // 3行以上の空白を2行へ
        .replace(
            /\n{3,}/g,
            "\n\n"
        );
}



/* ============================================================
   歌詞 → HTML
============================================================ */

function convertLyricsToHTML(
    text
) {

    // =========================================================
    // HTMLエスケープ
    // =========================================================

    let safe =
        escapeHTML(
            text
        );


    // =========================================================
    // ルビ
    //
    // {残響|ね}
    //
    // ↓
    //
    // <ruby>
    //   残響
    //   <rt>ね</rt>
    // </ruby>
    // =========================================================

    safe =
        safe.replace(
            /\{([^{}|]+)\|([^{}]+)\}/g,
            "<ruby>$1<rt>$2</rt></ruby>"
        );


    // =========================================================
    // 改行
    // =========================================================

    const lines =
        safe.split(
            /\r?\n/
        );


    return lines

        .map(
            line => {

                if (
                    line.trim() === ""
                ) {

                    return "<br>";
                }


                return `${line}<br>`;
            }
        )

        .join("\n");
}



/* ============================================================
   言語ボタン生成
============================================================ */

function createLanguageButtons(
    song,
    languages
) {

    const container =
        document.getElementById(
            "lang-switch"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    // =========================================================
    // 1言語だけならボタン不要
    // =========================================================

    if (
        languages.length <= 1
    ) {

        container.hidden =
            true;

        return;
    }


    container.hidden =
        false;


    // =========================================================
    // ボタン生成
    // =========================================================

    languages.forEach(
        lang => {

            const data =
                song.languages[lang];


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "lang-btn";


            button.dataset.lang =
                lang;


            button.textContent =
                data.name ?? lang;


            button.addEventListener(
                "click",
                () => {

                    loadLyrics(
                        song,
                        lang
                    );
                }
            );


            container.appendChild(
                button
            );
        }
    );
}



/* ============================================================
   使用可能言語
============================================================ */

function getAvailableLanguages(
    languages
) {

    if (!languages) {
        return [];
    }


    return Object.keys(
        languages
    )

        .filter(
            lang => {

                const data =
                    languages[lang];


                // 完全非表示
                if (
                    data.hidden
                ) {

                    return false;
                }


                return true;
            }
        );
}



/* ============================================================
   言語ボタン選択状態
============================================================ */

function setActiveLanguage(
    lang
) {

    document
        .querySelectorAll(
            ".lang-btn"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "is-active",
                    button.dataset.lang === lang
                );
            }
        );
}



/* ============================================================
   動画
============================================================ */

function setupVideo(
    video
) {

    const media =
        document.getElementById(
            "media-follow"
        );


    const side =
        document.getElementById(
            "lyrics-video"
        );


    if (
        !media ||
        !side
    ) {
        return;
    }


    // 初期化
    side.innerHTML = "";


    // =========================================================
    // 動画なし
    // =========================================================

    if (!video?.url) {

        side.hidden =
            true;

        return;
    }


    side.hidden =
        false;


    // =========================================================
    // 動画用BOX
    // =========================================================

    const box =
        document.createElement(
            "div"
        );


    box.className =
        "media-follow__box";


    // =========================================================
    // YouTube / iframe
    // =========================================================

    if (
        !video.type ||
        video.type === "youtube" ||
        video.type === "iframe"
    ) {

        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.src =
            video.url;


        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";


        iframe.allowFullscreen =
            true;


        iframe.loading =
            "lazy";


        box.appendChild(
            iframe
        );
    }


    // =========================================================
    // MP4など
    // =========================================================

    else if (
        video.type === "file"
    ) {

        const player =
            document.createElement(
                "video"
            );


        player.src =
            video.url;


        player.controls =
            true;


        player.preload =
            "metadata";


        player.style.width =
            "100%";


        player.style.height =
            "100%";


        box.appendChild(
            player
        );
    }


    side.appendChild(
        box
    );
}



/* ============================================================
   Release / CD情報
============================================================ */

function renderRelease(
    song,
    release
) {

    const section =
        document.getElementById(
            "release"
        );


    if (!section) {
        return;
    }


    section.hidden =
        false;


    // =========================================================
    // ジャケット
    // =========================================================

    const image =
        document.getElementById(
            "release-image"
        );


    if (image) {

        image.src =
            release.image ??
            "../img/yellow.png";


        image.alt =
            `${release.title ?? song.title} ジャケット`;
    }


    // =========================================================
    // タイトル
    // =========================================================

    setText(
        "release-title",
        release.title ??
        song.title
    );


    // =========================================================
    // 品番・日付
    // =========================================================

    let sub =
        "";


    if (
        release.catalog
    ) {

        sub +=
            release.catalog;
    }


    if (
        release.date
    ) {

        sub +=
            `${sub ? " ・ " : ""}` +
            `${release.date} 発表`;
    }


    setText(
        "release-sub",
        sub || "-"
    );


    // =========================================================
    // 収録曲
    // =========================================================

    setText(
        "release-track",
        `${song.title} / ${joinNames(song.arranger)}`
    );


    // =========================================================
    // 編曲
    // =========================================================

    setText(
        "release-arranger",
        joinNames(song.arranger)
    );


    // =========================================================
    // 作詞
    // =========================================================

    setText(
        "release-lyricist",
        joinNames(song.lyricist)
    );


    // =========================================================
    // イベント
    // =========================================================

    setText(
        "release-event",
        release.event ?? "-"
    );


    // =========================================================
    // 頒布形態
    // =========================================================

    setText(
        "release-format",
        release.format ?? "-"
    );


    // =========================================================
    // ジャンル
    // =========================================================

    setText(
        "release-genre",
        song.genre ??
        release.genre ??
        "-"
    );


    // =========================================================
    // 作品ページ
    // =========================================================

    const link =
        document.getElementById(
            "release-page-link"
        );


    if (!link) {
        return;
    }


    if (release.url) {

        link.href =
            release.url;

        link.hidden =
            false;

    } else {

        link.hidden =
            true;
    }
}



/* ============================================================
   ページMeta / OGP更新
============================================================ */

function updatePageMeta(
    song
) {

    const title =
        `Cadence｜${song.title}`;


    // =========================================================
    // Title
    // =========================================================

    updateMeta(
        'meta[property="og:title"]',
        title
    );


    updateMeta(
        'meta[name="twitter:title"]',
        title
    );


    // =========================================================
    // Description
    // =========================================================

    if (
        song.description
    ) {

        updateMeta(
            'meta[property="og:description"]',
            song.description
        );


        updateMeta(
            'meta[name="twitter:description"]',
            song.description
        );
    }


    // =========================================================
    // Image
    // =========================================================

    if (
        song.release?.image
    ) {

        const imageUrl =
            absoluteUrl(
                song.release.image
            );


        updateMeta(
            'meta[property="og:image"]',
            imageUrl
        );


        updateMeta(
            'meta[name="twitter:image"]',
            imageUrl
        );
    }


    // =========================================================
    // URL
    // =========================================================

    updateMeta(
        'meta[property="og:url"]',
        location.href
    );


    // =========================================================
    // Share
    // =========================================================

    const share =
        document.getElementById(
            "share-buttons"
        );


    if (share) {

        share.dataset.shareTitle =
            song.title;
    }
}



/* ============================================================
   名前一覧
============================================================ */

function joinNames(
    value
) {

    if (!value) {
        return "-";
    }


    if (
        Array.isArray(value)
    ) {

        return value.join(
            " & "
        );
    }


    return value;
}



/* ============================================================
   テキストセット
============================================================ */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.textContent =
        value ?? "-";
}



/* ============================================================
   エラー
============================================================ */

function showError(
    message
) {

    const title =
        document.getElementById(
            "song-title"
        );


    if (title) {

        title.textContent =
            "歌詞ページ";
    }


    showLyricsMessage(
        message
    );
}



/* ============================================================
   メッセージ表示
============================================================ */

function showLyricsMessage(
    message
) {

    const element =
        document.getElementById(
            "lyrics-message"
        );


    if (element) {

        element.textContent =
            message;


        element.hidden =
            false;
    }


    const lyrics =
        document.getElementById(
            "lyrics-text"
        );


    if (lyrics) {

        lyrics.innerHTML =
            "";
    }
}



/* ============================================================
   HTML Escape
============================================================ */

function escapeHTML(
    text
) {

    return text

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}



/* ============================================================
   Meta更新
============================================================ */

function updateMeta(
    selector,
    value
) {

    const element =
        document.querySelector(
            selector
        );


    if (!element) {
        return;
    }


    element.setAttribute(
        "content",
        value
    );
}



/* ============================================================
   URL絶対化
============================================================ */

function absoluteUrl(
    url
) {

    try {

        return new URL(
            url,
            location.href
        ).href;

    } catch {

        return url;
    }
}



/* ============================================================
   日時表示
============================================================ */

function formatDateTime(
    date
) {

    return new Intl.DateTimeFormat(
        "ja-JP",
        {
            year:
                "numeric",

            month:
                "2-digit",

            day:
                "2-digit",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    ).format(
        date
    );
}