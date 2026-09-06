(() => {
    "use strict";

    // =========================================================
    // 設定
    // =========================================================
    const CONFIG = {

        // DLCデータ
        dataURL: "./data/downloads.json",

        // 認証失敗時の戻り先
        // 相対パスなのでローカル / GitHub Pages 両対応
        redirectURL: "./dl.html",

        // sessionStorageのキー
        accessKey: "cadenceDlcAccess"
    };


    // =========================================================
    // フォーマット表示設定
    // =========================================================
    const FORMAT_INFO = {
        mp3: {
            label: "MP3"
        },

        wav: {
            label: "WAV"
        },

        flac: {
            label: "FLAC"
        },

        txt: {
            label: "TXT"
        },

        pdf: {
            label: "PDF"
        },

        zip: {
            label: "ZIP"
        },

        png: {
            label: "PNG"
        },

        jpg: {
            label: "JPG"
        },

        jpeg: {
            label: "JPEG"
        }
    };


    // =========================================================
    // 起動
    // =========================================================
    document.addEventListener(
        "DOMContentLoaded",
        init
    );


    // =========================================================
    // 初期化
    // =========================================================
    async function init() {

        // -----------------------------------------------------
        // URLからトークン取得
        //
        // dlc.html?t=xxxxxxxx
        // -----------------------------------------------------
        const params =
            new URLSearchParams(
                window.location.search
            );

        const token =
            params.get("t");


        // -----------------------------------------------------
        // tokenなし
        // -----------------------------------------------------
        if (!token) {

            console.warn(
                "[DLC] tokenがありません。"
            );

            redirect();

            return;
        }


        // -----------------------------------------------------
        // 正規アクセス確認
        // -----------------------------------------------------
        if (!checkAccess(token)) {

            console.warn(
                "[DLC] 正規アクセスではありません。"
            );

            redirect();

            return;
        }


        // -----------------------------------------------------
        // downloads.json 読み込み
        // -----------------------------------------------------
        let dataList;

        try {

            const response =
                await fetch(
                    CONFIG.dataURL,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            dataList =
                await response.json();

        }
        catch (error) {

            console.error(
                "[DLC] downloads.json の読み込みに失敗しました。",
                error
            );

            redirect();

            return;
        }


        // -----------------------------------------------------
        // 商品取得
        //
        // downloads.json のキー = token
        // -----------------------------------------------------
        const data =
            dataList[token];


        // -----------------------------------------------------
        // 商品なし
        // -----------------------------------------------------
        if (!data) {

            console.warn(
                "[DLC] 該当する商品データがありません。",
                token
            );

            redirect();

            return;
        }


        // -----------------------------------------------------
        // ファイル確認
        // -----------------------------------------------------
        if (
            !Array.isArray(data.files) ||
            data.files.length === 0
        ) {

            console.warn(
                "[DLC] ダウンロードファイルがありません。"
            );

            redirect();

            return;
        }


        // -----------------------------------------------------
        // ページ生成
        // -----------------------------------------------------
        renderPage(data);
    }


    // =========================================================
    // 正規アクセス確認
    //
    // 1. dl.htmlから来ている
    // 2. sessionStorageに認証情報が存在
    // 3. URLのtokenと認証tokenが一致
    // 4. 有効期限内
    // =========================================================
    function checkAccess(token) {

        // -----------------------------------------------------
        // Referrer確認
        // -----------------------------------------------------
        if (!checkReferrer()) {

            console.warn(
                "[DLC] Referrer NG"
            );

            return false;
        }


        // -----------------------------------------------------
        // sessionStorage取得
        // -----------------------------------------------------
        const stored =
            sessionStorage.getItem(
                CONFIG.accessKey
            );


        if (!stored) {

            console.warn(
                "[DLC] sessionStorageに認証情報がありません。"
            );

            return false;
        }


        // -----------------------------------------------------
        // JSON解析
        // -----------------------------------------------------
        let access;

        try {

            access =
                JSON.parse(stored);

        }
        catch (error) {

            console.warn(
                "[DLC] 認証情報の解析に失敗しました。",
                error
            );

            clearAccess();

            return false;
        }


        // -----------------------------------------------------
        // データ形式確認
        // -----------------------------------------------------
        if (
            !access ||
            typeof access !== "object"
        ) {

            clearAccess();

            return false;
        }


        // -----------------------------------------------------
        // token確認
        // -----------------------------------------------------
        if (
            !access.token ||
            access.token !== token
        ) {

            console.warn(
                "[DLC] tokenが一致しません。"
            );

            return false;
        }


        // -----------------------------------------------------
        // 有効期限確認
        // -----------------------------------------------------
        if (
            !Number.isFinite(
                access.expiresAt
            )
        ) {

            console.warn(
                "[DLC] 有効期限情報が不正です。"
            );

            clearAccess();

            return false;
        }


        if (
            Date.now() >
            access.expiresAt
        ) {

            console.warn(
                "[DLC] 認証期限切れです。"
            );

            clearAccess();

            return false;
        }


        // -----------------------------------------------------
        // 全チェックOK
        // -----------------------------------------------------
        return true;
    }


    // =========================================================
    // Referrer確認
    // =========================================================
    function checkReferrer() {

        const referrer =
            document.referrer;


        // -----------------------------------------------------
        // URL直接入力
        // ブックマーク
        // 外部アプリなど
        // -----------------------------------------------------
        if (!referrer) {

            return false;
        }


        try {

            const referrerURL =
                new URL(referrer);


            // -------------------------------------------------
            // 外部サイトからのアクセス
            // -------------------------------------------------
            if (
                referrerURL.origin !==
                window.location.origin
            ) {

                return false;
            }


            // -------------------------------------------------
            // dl.htmlから来たか
            //
            // ローカル:
            // /special/dl.html
            //
            // GitHub Pages:
            // /Cadence/special/dl.html
            //
            // 両方対応
            // -------------------------------------------------
            if (
                !referrerURL.pathname.endsWith(
                    "/special/dl.html"
                )
            ) {

                return false;
            }


            return true;

        }
        catch (error) {

            console.warn(
                "[DLC] Referrer解析失敗",
                error
            );

            return false;
        }
    }


    // =========================================================
    // 認証情報削除
    // =========================================================
    function clearAccess() {

        sessionStorage.removeItem(
            CONFIG.accessKey
        );

    }


    // =========================================================
    // リダイレクト
    // =========================================================
    function redirect() {

        window.location.replace(
            CONFIG.redirectURL
        );

    }


    // =========================================================
    // ページ生成
    // =========================================================
    function renderPage(data) {

        updateMeta(data);

        renderTitle(data);

        renderCover(data);

        renderDetailLink(data);

        renderIcon(
            data.icon
        );

        renderFiles(
            data.files
        );

        renderZipPassword();


        // -----------------------------------------------------
        // 最後にページ表示
        // -----------------------------------------------------
        const page =
            document.getElementById(
                "download-page"
            );


        if (page) {

            page.hidden = false;

        }
    }


    // =========================================================
    // タイトル / Meta
    // =========================================================
    function updateMeta(data) {

        const pageTitle =
            data.pageTitle ||
            `Cadence｜DLC(${data.title})`;


        const description =
            data.description ||
            `${data.title}のDLCを入手できます。`;


        document.title =
            pageTitle;


        setMeta(
            "og-title",
            pageTitle
        );


        setMeta(
            "og-description",
            description
        );


        setMeta(
            "twitter-title",
            pageTitle
        );


        setMeta(
            "twitter-description",
            description
        );
    }


    // =========================================================
    // Meta設定
    // =========================================================
    function setMeta(
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


        element.setAttribute(
            "content",
            value
        );
    }


    // =========================================================
    // 作品名 / メッセージ
    // =========================================================
    function renderTitle(data) {

        const title =
            document.getElementById(
                "download-title"
            );


        if (title) {

            title.textContent =
                data.title || "";

        }


        const thanks =
            document.getElementById(
                "download-thanks"
            );


        if (thanks) {

            thanks.textContent =
                `「${data.title || ""}」をご購入いただきありがとうございます。`;

        }
    }


    // =========================================================
    // ジャケット
    // =========================================================
    function renderCover(data) {

        const cover =
            document.getElementById(
                "download-cover"
            );


        if (!cover) {

            return;

        }


        // -----------------------------------------------------
        // ジャケットなし
        // -----------------------------------------------------
        if (!data.cover) {

            const area =
                cover.closest(
                    ".download-cover-wrap"
                ) ||
                cover.closest(
                    ".download-cover-area"
                );


            if (area) {

                area.hidden = true;

            }
            else {

                cover.hidden = true;

            }


            return;
        }


        // -----------------------------------------------------
        // ジャケットあり
        // -----------------------------------------------------
        cover.src =
            data.cover;


        cover.alt =
            data.title || "";


        cover.hidden =
            false;
    }


    // =========================================================
    // 作品詳細リンク
    // =========================================================
    function renderDetailLink(data) {

        const link =
            document.getElementById(
                "download-detail-link"
            );


        if (!link) {

            return;

        }


        // -----------------------------------------------------
        // 詳細ページなし
        // -----------------------------------------------------
        if (!data.page) {

            link.hidden =
                true;


            link.removeAttribute(
                "href"
            );


            return;
        }


        // -----------------------------------------------------
        // 詳細ページあり
        // -----------------------------------------------------
        link.href =
            data.page;


        link.hidden =
            false;
    }


    // =========================================================
    // アイコン
    // =========================================================
    function renderIcon(icon) {

        const root =
            document.getElementById(
                "download-icon"
            );


        if (!root) {

            return;

        }


        // 初期化
        root.replaceChildren();


        if (!icon) {

            root.hidden =
                true;

            return;
        }


        // -----------------------------------------------------
        // FontAwesome
        // -----------------------------------------------------
        if (
            icon.type === "fa"
        ) {

            const element =
                document.createElement(
                    "i"
                );


            element.className =
                icon.class || "";


            root.appendChild(
                element
            );


            root.hidden =
                false;


            return;
        }


        // -----------------------------------------------------
        // 画像
        // -----------------------------------------------------
        if (
            icon.type === "image"
        ) {

            if (!icon.src) {

                root.hidden =
                    true;

                return;
            }


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                icon.src;


            image.alt =
                icon.alt || "";


            root.appendChild(
                image
            );


            root.hidden =
                false;


            return;
        }


        // -----------------------------------------------------
        // Emoji
        // -----------------------------------------------------
        if (
            icon.type === "emoji"
        ) {

            root.textContent =
                icon.text || "";


            root.hidden =
                !icon.text;


            return;
        }


        // -----------------------------------------------------
        // 不明な形式
        // -----------------------------------------------------
        root.hidden =
            true;
    }


    // =========================================================
    // ファイル
    // =========================================================
    function renderFiles(files) {

        const root =
            document.getElementById(
                "download-file-area"
            );


        if (!root) {

            return;

        }


        root.replaceChildren();


        // -----------------------------------------------------
        // 1形式
        // -----------------------------------------------------
        if (
            files.length === 1
        ) {

            renderSingleFile(
                root,
                files[0]
            );


            return;
        }


        // -----------------------------------------------------
        // 複数形式
        // -----------------------------------------------------
        renderFileSelector(
            root,
            files
        );
    }


    // =========================================================
    // 1形式
    // =========================================================
    function renderSingleFile(
        root,
        file
    ) {

        const container =
            document.createElement(
                "div"
            );


        container.className =
            "download-single";


        // -----------------------------------------------------
        // ファイル情報
        // -----------------------------------------------------
        const info =
            document.createElement(
                "div"
            );


        info.className =
            "download-single-info";


        // -----------------------------------------------------
        // フォーマット
        // -----------------------------------------------------
        const format =
            document.createElement(
                "strong"
            );


        format.className =
            "download-format-name";


        format.textContent =
            getFormatLabel(
                file
            );


        info.appendChild(
            format
        );


        // -----------------------------------------------------
        // サイズ
        // -----------------------------------------------------
        if (file.size) {

            const size =
                document.createElement(
                    "span"
                );


            size.className =
                "download-file-size";


            size.textContent =
                file.size;


            info.appendChild(
                size
            );
        }


        container.appendChild(
            info
        );


        container.appendChild(
            createDownloadButton(
                file
            )
        );


        root.appendChild(
            container
        );
    }


    // =========================================================
    // 複数形式
    // =========================================================
    function renderFileSelector(
        root,
        files
    ) {

        const form =
            document.createElement(
                "div"
            );


        form.className =
            "download-selector";


        // -----------------------------------------------------
        // Label
        // -----------------------------------------------------
        const label =
            document.createElement(
                "label"
            );


        label.htmlFor =
            "download-format";


        label.className =
            "download-selector-label";


        label.textContent =
            "ファイル形式";


        // -----------------------------------------------------
        // Select
        // -----------------------------------------------------
        const select =
            document.createElement(
                "select"
            );


        select.id =
            "download-format";


        select.className =
            "download-format-select";


        // -----------------------------------------------------
        // 選択肢生成
        // -----------------------------------------------------
        files.forEach(
            (
                file,
                index
            ) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    String(index);


                let text =
                    getFormatLabel(
                        file
                    );


                if (file.size) {

                    text +=
                        ` — ${file.size}`;

                }


                option.textContent =
                    text;


                select.appendChild(
                    option
                );
            }
        );


        // -----------------------------------------------------
        // ボタン領域
        // -----------------------------------------------------
        const buttonArea =
            document.createElement(
                "div"
            );


        buttonArea.className =
            "download-button-area";


        // -----------------------------------------------------
        // ボタン更新
        // -----------------------------------------------------
        function updateButton() {

            const index =
                Number(
                    select.value
                );


            const file =
                files[index];


            if (!file) {

                buttonArea.replaceChildren();

                return;
            }


            buttonArea.replaceChildren(
                createDownloadButton(
                    file
                )
            );
        }


        // -----------------------------------------------------
        // Select変更
        // -----------------------------------------------------
        select.addEventListener(
            "change",
            updateButton
        );


        // -----------------------------------------------------
        // DOM追加
        // -----------------------------------------------------
        form.appendChild(
            label
        );


        form.appendChild(
            select
        );


        form.appendChild(
            buttonArea
        );


        root.appendChild(
            form
        );


        // 初期ボタン生成
        updateButton();
    }


    // =========================================================
    // ダウンロードボタン
    // =========================================================
    function createDownloadButton(
        file
    ) {

        const button =
            document.createElement(
                "a"
            );


        button.className =
            "download-main-button";


        // -----------------------------------------------------
        // URLなし
        // -----------------------------------------------------
        if (!file.url) {

            button.href =
                "#";


            button.setAttribute(
                "aria-disabled",
                "true"
            );


            button.classList.add(
                "is-disabled"
            );


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                }
            );

        }

        // -----------------------------------------------------
        // URLあり
        // -----------------------------------------------------
        else {

            button.href =
                file.url;


            button.target =
                "_blank";


            button.rel =
                "noopener noreferrer";
        }


        // -----------------------------------------------------
        // ボタン文字
        // -----------------------------------------------------
        const text =
            file.buttonText ||
            `${getFormatLabel(file)}をダウンロード`;


        const label =
            document.createElement(
                "span"
            );


        label.textContent =
            text;


        // -----------------------------------------------------
        // アイコン
        // -----------------------------------------------------
        const icon =
            document.createElement(
                "i"
            );


        icon.className =
            "fas fa-download";


        icon.setAttribute(
            "aria-hidden",
            "true"
        );


        // -----------------------------------------------------
        // DOM
        // -----------------------------------------------------
        button.appendChild(
            label
        );
        button.appendChild(
            icon
        );
        return button;
    }


    // =========================================================
    // フォーマット名
    // =========================================================
    function getFormatLabel(file) {
        // 独自ラベル
        if (file.label) {
            return file.label;
        }

        const format =
            String(
                file.format || ""
            )
                .toLowerCase();

        // 登録済み形式
        if (
            FORMAT_INFO[format]
        ) {
            return FORMAT_INFO[
                format
            ].label;
        }
        // 未登録形式
        if (format) {
            return format.toUpperCase();
        }
        return "ファイル";
    }

})();

// ==========================================
// ZIPパスワード表示
// ==========================================
function renderZipPassword() {

    const area =
        document.getElementById("zip-password-area");

    const canvas =
        document.getElementById("zip-password-canvas");

    if (!area || !canvas) {
        return;
    }

    let access;

    try {
        access = JSON.parse(
            sessionStorage.getItem(
                "cadenceDlcAccess"
            ) || "{}"
        );
    }
    catch (error) {

        console.warn(
            "[DLC] ZIPパスワード情報の取得に失敗しました。",
            error
        );

        area.hidden = true;

        return;
    }

    const password =
        access.zipPassword;

    if (!password) {

        area.hidden = true;

        return;
    }

    area.hidden = false;

    drawProtectedCode(
        canvas,
        password,
        access.token || ""
    );
}


// ==========================================
// Canvasへパスワード描画
// ==========================================
function drawProtectedCode(
    canvas,
    password,
    token
) {

    const ctx =
        canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    const width =
        canvas.width;

    const height =
        canvas.height;

    const centerY =
        height / 2;


    // --------------------------------------
    // Canvas初期化
    // --------------------------------------
    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------
    // 背景
    // --------------------------------------
    ctx.fillStyle =
        "#fafafa";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------
    // OCR妨害用文字
    // 紛らわしい文字は除外
    // --------------------------------------
    const noiseChars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ" +
        "abcdefghijkmnopqrstuvwxyz" +
        "23456789";


    // --------------------------------------
    // 全体の薄いダミー文字
    // --------------------------------------
    for (let i = 0; i < 45; i++) {

        ctx.save();

        const fontSize =
            10 +
            Math.random() * 6;

        ctx.font =
            `${fontSize}px monospace`;

        ctx.globalAlpha =
            0.035 +
            Math.random() * 0.07;

        ctx.fillStyle =
            "#000";

        ctx.translate(
            Math.random() * width,
            Math.random() * height
        );

        ctx.rotate(
            Math.random() * 0.8 -
            0.4
        );

        ctx.fillText(
            noiseChars[
            Math.floor(
                Math.random() *
                noiseChars.length
            )
            ],
            0,
            0
        );

        ctx.restore();
    }


    // --------------------------------------
    // 中央付近のダミー文字
    // --------------------------------------
    for (let i = 0; i < 16; i++) {

        ctx.save();

        const fontSize =
            16 +
            Math.random() * 9;

        const bold =
            Math.random() > 0.55
                ? "bold "
                : "";

        ctx.font =
            `${bold}${fontSize}px monospace`;

        ctx.globalAlpha =
            0.08 +
            Math.random() * 0.10;

        ctx.fillStyle =
            "#000";

        ctx.translate(
            35 +
            Math.random() *
            (width - 70),

            centerY +
            Math.random() * 44 -
            22
        );

        ctx.rotate(
            Math.random() * 0.55 -
            0.275
        );

        ctx.fillText(
            noiseChars[
            Math.floor(
                Math.random() *
                noiseChars.length
            )
            ],
            0,
            0
        );

        ctx.restore();
    }


    // --------------------------------------
    // 全体のランダム曲線
    // --------------------------------------
    for (let i = 0; i < 18; i++) {

        ctx.beginPath();

        ctx.moveTo(
            Math.random() * width,
            Math.random() * height
        );

        ctx.bezierCurveTo(
            Math.random() * width,
            Math.random() * height,

            Math.random() * width,
            Math.random() * height,

            Math.random() * width,
            Math.random() * height
        );

        ctx.strokeStyle =
            `rgba(0,0,0,${0.04 +
            Math.random() * 0.08
            })`;

        ctx.lineWidth =
            0.5 +
            Math.random() * 1.2;

        ctx.stroke();
    }


    // --------------------------------------
    // パスワード領域付近の曲線
    // --------------------------------------
    for (let i = 0; i < 6; i++) {

        const y =
            centerY +
            Math.random() * 30 -
            15;

        ctx.beginPath();

        ctx.moveTo(
            25,
            y
        );

        ctx.bezierCurveTo(
            width * 0.30,
            y +
            Math.random() * 20 -
            10,

            width * 0.70,
            y +
            Math.random() * 20 -
            10,

            width - 25,
            y +
            Math.random() * 14 -
            7
        );

        ctx.strokeStyle =
            `rgba(0,0,0,${0.07 +
            Math.random() * 0.08
            })`;

        ctx.lineWidth =
            0.7 +
            Math.random() * 1.0;

        ctx.stroke();
    }


    // --------------------------------------
    // 斜め妨害線
    // --------------------------------------
    for (let i = 0; i < 7; i++) {

        const startX =
            20 +
            Math.random() *
            (width - 40);

        const startY =
            centerY -
            25 +
            Math.random() * 18;

        const direction =
            Math.random() > 0.5
                ? 1
                : -1;

        ctx.beginPath();

        ctx.moveTo(
            startX,
            startY
        );

        ctx.lineTo(
            startX +
            direction *
            (
                30 +
                Math.random() * 65
            ),

            centerY +
            15 +
            Math.random() * 18
        );

        ctx.strokeStyle =
            `rgba(0,0,0,${0.06 +
            Math.random() * 0.09
            })`;

        ctx.lineWidth =
            0.6 +
            Math.random();

        ctx.stroke();
    }

    // --------------------------------------
    // 縦寄りの妨害線
    // --------------------------------------
    for (let i = 0; i < 5; i++) {

        const x =
            width * 0.20 +
            Math.random() * width * 0.60;

        const topX =
            x +
            Math.random() * 12 -
            6;

        const bottomX =
            x +
            Math.random() * 12 -
            6;

        ctx.beginPath();

        ctx.moveTo(
            topX,
            centerY - 27
        );

        ctx.bezierCurveTo(
            x + Math.random() * 10 - 5,
            centerY - 12,

            x + Math.random() * 10 - 5,
            centerY + 12,

            bottomX,
            centerY + 27
        );

        ctx.strokeStyle =
            `rgba(0,0,0,${0.07 +
            Math.random() * 0.07
            })`;

        ctx.lineWidth =
            0.6 +
            Math.random() * 0.6;

        ctx.stroke();
    }


    // --------------------------------------
    // 短い線分ノイズ
    // --------------------------------------
    for (let i = 0; i < 35; i++) {

        const x =
            Math.random() * width;

        const y =
            Math.random() * height;

        const length =
            5 +
            Math.random() * 22;

        const angle =
            Math.random() *
            Math.PI;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x +
            Math.cos(angle) *
            length,

            y +
            Math.sin(angle) *
            length
        );

        ctx.strokeStyle =
            `rgba(0,0,0,${0.025 +
            Math.random() * 0.06
            })`;

        ctx.lineWidth =
            0.4 +
            Math.random() * 0.7;

        ctx.stroke();
    }


    // --------------------------------------
    // 点ノイズ
    // --------------------------------------
    for (let i = 0; i < 80; i++) {

        ctx.beginPath();

        ctx.arc(
            Math.random() * width,
            Math.random() * height,

            0.3 +
            Math.random() * 0.8,

            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(0,0,0,${0.025 +
            Math.random() * 0.07
            })`;

        ctx.fill();
    }


    // --------------------------------------
    // セッション識別用透かし
    // --------------------------------------
    if (token) {

        const shortToken =
            token
                .slice(0, 8)
                .toUpperCase();

        const watermark =
            `CADENCE-${shortToken}`;

        const positions = [
            {
                x: width * 0.18,
                y: height * 0.20,
                angle: -0.20
            },
            {
                x: width * 0.50,
                y: height * 0.77,
                angle: 0.10
            },
            {
                x: width * 0.82,
                y: height * 0.25,
                angle: 0.20
            }
        ];

        for (
            const pos of positions
        ) {

            ctx.save();

            ctx.translate(
                pos.x,
                pos.y
            );

            ctx.rotate(
                pos.angle +
                Math.random() * 0.08 -
                0.04
            );

            ctx.font =
                "10px monospace";

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillStyle =
                `rgba(0,0,0,${0.04 +
                Math.random() * 0.035
                })`;

            ctx.fillText(
                watermark,
                0,
                0
            );

            ctx.restore();
        }
    }


    // ======================================
    // 本物のZIPパスワード
    // ======================================

    const chars =
        [...password];

    const charSpacing =
        31;

    const passwordWidth =
        (
            chars.length - 1
        ) *
        charSpacing;

    const passwordStartX =
        width / 2 -
        passwordWidth / 2;


    // --------------------------------------
    // 本物を1文字ずつ描画
    // 上下・角度・横幅を少し変える
    // --------------------------------------
    chars.forEach(
        (
            char,
            index
        ) => {

            const x =
                passwordStartX +
                index *
                charSpacing +
                (
                    Math.random() * 4 -
                    2
                );

            const y =
                centerY +
                (
                    Math.random() * 10 -
                    5
                );

            const angle =
                Math.random() * 0.20 -
                0.10;

            const scaleX =
                0.88 +
                Math.random() * 0.24;

            const scaleY =
                0.94 +
                Math.random() * 0.12;

            const fontSize =
                25 +
                Math.random() * 4;

            ctx.save();

            ctx.translate(
                x,
                y
            );

            ctx.rotate(
                angle
            );

            ctx.scale(
                scaleX,
                scaleY
            );

            ctx.font =
                `bold ${fontSize}px monospace`;

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillStyle =
                `rgba(0,0,0,${0.72 + Math.random() * 0.14
                })`;

            ctx.fillText(
                char,
                0,
                0
            );

            ctx.restore();
        }
    );


    // --------------------------------------
    // 本物を横切る妨害線
    // 本物描画後なので文字にも重なる
    // --------------------------------------
    for (let i = 0; i < 4; i++) {

        const y1 =
            centerY +
            Math.random() * 26 -
            13;

        const y2 =
            centerY +
            Math.random() * 26 -
            13;

        ctx.beginPath();

        ctx.moveTo(
            passwordStartX - 18,
            y1
        );

        ctx.lineTo(
            passwordStartX +
            passwordWidth +
            18,
            y2
        );

        ctx.strokeStyle =
            `rgba(0,0,0,${0.12 +
            Math.random() * 0.08
            })`;

        ctx.lineWidth =
            0.8 +
            Math.random() * 0.6;

        ctx.stroke();
    }


    // --------------------------------------
    // パスワード付近の濃いダミー文字
    // 最後に少数だけ重ねる
    // --------------------------------------
    for (let i = 0; i < 17; i++) {

        ctx.save();

        const x =
            passwordStartX -
            8 +
            Math.random() *
            (
                passwordWidth +
                16
            );

        const y =
            centerY +
            Math.random() * 34 -
            17;

        const fontSize =
            17 +
            Math.random() * 6;

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            Math.random() * 0.4 -
            0.2
        );

        ctx.font =
            `${fontSize}px monospace`;

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillStyle =
            `rgba(0,0,0,${0.09 +
            Math.random() * 0.08
            })`;

        ctx.fillText(
            noiseChars[
            Math.floor(
                Math.random() *
                noiseChars.length
            )
            ],
            0,
            0
        );

        ctx.restore();
    }
}