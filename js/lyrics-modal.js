/*! lyrics-modal v6 - songs.json + txt */

document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // 設定
  // =========================================================

  const SONGS_JSON_URL = "../lyrics/songs.json";
  const LYRICS_BASE_URL = "../lyrics/";
  const LYRICS_PAGE_URL = "../lyrics/l.html";


  // =========================================================
  // モーダル生成
  // =========================================================

  const modal = document.createElement("div");

  modal.id = "lyrics-modal";

  modal.innerHTML = `
    <div class="ly-overlay" aria-hidden="true"></div>

    <div
      class="ly-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ly-title"
    >
      <div class="ly-head">

        <h3
          id="ly-title"
          class="ly-title">
        </h3>

        <div class="ly-actions">

          <a
            class="ly-open"
            target="_blank"
            rel="noopener"
            hidden>
            全文を開く
          </a>

          <button
            class="ly-close"
            type="button"
            aria-label="閉じる">
            ×
          </button>

        </div>
      </div>

      <div class="ly-body">
        <div class="ly-loading">
          読み込み中…
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);


  const overlay =
    modal.querySelector(".ly-overlay");

  const body =
    modal.querySelector(".ly-body");

  const titleEl =
    modal.querySelector(".ly-title");

  const openEl =
    modal.querySelector(".ly-open");

  const closeEl =
    modal.querySelector(".ly-close");


  // =========================================================
  // モーダル開閉
  // =========================================================

  function openModal() {

    modal.classList.add("open");

    document.body.classList.add(
      "modal-locked"
    );

    setTimeout(() => {
      closeEl.focus();
    }, 0);
  }


  function closeModal() {

    modal.classList.remove("open");

    document.body.classList.remove(
      "modal-locked"
    );

    body.innerHTML = "";

    titleEl.textContent = "";

    openEl.hidden = true;

    openEl.removeAttribute("href");
  }


  overlay.addEventListener(
    "click",
    closeModal
  );


  closeEl.addEventListener(
    "click",
    closeModal
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        modal.classList.contains("open")
      ) {
        closeModal();
      }
    }
  );


  // =========================================================
  // 共通
  // =========================================================

  function escapeHTML(text) {

    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function parseDate(value) {

    if (!value) {
      return null;
    }

    const time =
      new Date(value).getTime();

    if (Number.isNaN(time)) {
      return null;
    }

    return time;
  }


  function isPublished(value) {

    const time =
      parseDate(value);

    if (time === null) {
      return true;
    }

    return Date.now() >= time;
  }


  function formatDate(value) {

    const time =
      parseDate(value);

    if (time === null) {
      return "";
    }

    const date =
      new Date(time);

    const yyyy =
      date.getFullYear();

    const mm =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const dd =
      String(
        date.getDate()
      ).padStart(2, "0");

    const hh =
      String(
        date.getHours()
      ).padStart(2, "0");

    const mi =
      String(
        date.getMinutes()
      ).padStart(2, "0");

    return (
      `${yyyy}/${mm}/${dd} ` +
      `${hh}:${mi}`
    );
  }


  // =========================================================
  // 言語名
  // =========================================================

  function getLanguageLabel(
    code,
    language
  ) {

    if (language?.name) {
      return language.name;
    }


    const custom = {

      ja: "日本語",

      en: "English",

      zh: "中文",

      "zh-cn": "中文(简体)",

      "zh-hans": "中文(简体)",

      "zh-tw": "中文(繁體)",

      "zh-hant": "中文(繁體)",

      ko: "한국어",

      fr: "Français",

      de: "Deutsch",

      es: "Español",

      it: "Italiano"
    };


    const normalized =
      String(code || "")
        .trim()
        .toLowerCase();


    if (custom[normalized]) {
      return custom[normalized];
    }


    try {

      return (
        new Intl.DisplayNames(
          ["ja"],
          {
            type: "language"
          }
        ).of(normalized)
        ||
        normalized
      );

    } catch {

      return normalized;
    }
  }


  // =========================================================
  // songs.json
  // =========================================================

  let songsCache = null;


  async function loadSongs() {

    if (songsCache) {
      return songsCache;
    }


    const response =
      await fetch(
        SONGS_JSON_URL,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        `songs.json HTTP ${response.status}`
      );
    }


    songsCache =
      await response.json();


    return songsCache;
  }


  // =========================================================
  // 歌詞URL
  // =========================================================

  function getLyricsURL(file) {

    return new URL(
      file,
      new URL(
        LYRICS_BASE_URL,
        location.href
      )
    ).toString();
  }

  function joinNames(value) {
    if (!value) return "-";

    if (Array.isArray(value)) {
      return value.join(" & ");
    }

    return value;
  }


  function createSongInfo(song) {
    const info =
      document.createElement("div");

    info.className =
      "ly-song-info";


    const rows = [];


    // 作曲
    if (song.composer) {
      rows.push([
        "作曲",
        joinNames(song.composer)
      ]);
    }


    // 編曲
    if (song.arranger) {
      rows.push([
        "編曲",
        joinNames(song.arranger)
      ]);
    }


    // 作詞
    if (song.lyricist) {
      rows.push([
        "作詞",
        joinNames(song.lyricist)
      ]);
    }


    // ボーカル
    if (song.vocal) {
      rows.push([
        "ボーカル",
        joinNames(song.vocal)
      ]);
    }


    // 原曲
    if (song.original?.title) {
      let original =
        song.original.title;

      if (song.original.work) {
        original =
          `${song.original.work}「${song.original.title}」`;
      }

      rows.push([
        "原曲",
        original
      ]);
    }


    // リリース
    if (song.release?.title) {
      rows.push([
        "収録",
        song.release.title
      ]);
    }


    // イベント
    if (song.release?.event) {
      rows.push([
        "発表",
        song.release.event
      ]);
    }


    rows.forEach(
      ([label, value]) => {

        const p =
          document.createElement("p");


        const strong =
          document.createElement("strong");

        strong.textContent =
          `${label}: `;


        p.appendChild(
          strong
        );


        p.appendChild(
          document.createTextNode(
            value
          )
        );


        info.appendChild(
          p
        );
      }
    );


    return info;
  }


  // =========================================================
  // TXT読み込み
  // =========================================================

  async function loadLyricsText(
    language
  ) {

    if (!language?.file) {

      throw new Error(
        "歌詞ファイルが設定されていません。"
      );
    }


    const url =
      getLyricsURL(
        language.file
      );


    const response =
      await fetch(
        url,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        `歌詞 HTTP ${response.status}`
      );
    }


    return (
      await response.text()
    ).replace(
      /\r\n?/g,
      "\n"
    );
  }


  // =========================================================
  // preview処理
  // =========================================================

  function processPreview(
    text,
    song,
    language
  ) {

    const unlockAt =
      language.fullPublish ??
      song.publish?.fullLyrics ??
      null;


    const unlockTime =
      parseDate(unlockAt);


    const locked =
      unlockTime !== null &&
      Date.now() < unlockTime;


    const markerRegex =
      /^[ \t]*\[preview-end\][ \t]*$/m;


    const marker =
      text.match(
        markerRegex
      );


    // マーカーなし
    if (!marker) {

      return {
        text,
        locked: false,
        unlockAt
      };
    }


    // 公開前
    if (locked) {

      let preview =
        text.substring(
          0,
          marker.index
        );


      preview =
        preview.replace(
          /\n+$/,
          ""
        );


      return {
        text: preview,
        locked: true,
        unlockAt
      };
    }


    // 公開後
    text =
      text
        .replace(
          /^[ \t]*\[preview-end\][ \t]*$/gm,
          ""
        )
        .replace(
          /\n{3,}/g,
          "\n\n"
        );


    return {
      text,
      locked: false,
      unlockAt
    };
  }


  // =========================================================
  // TXT → HTML
  // =========================================================

  function convertLyricsToHTML(
    text
  ) {

    let safe =
      escapeHTML(text);


    // {残響|ね}
    // ↓
    // ruby
    safe =
      safe.replace(
        /\{([^{}|]+)\|([^{}]+)\}/g,
        "<ruby>$1<rt>$2</rt></ruby>"
      );


    const lines =
      safe.split("\n");


    return lines
      .map(line => {

        if (
          line.trim() === ""
        ) {
          return "<br>";
        }


        return `${line}<br>`;
      })
      .join("\n");
  }


  // =========================================================
  // 1言語分の歌詞を読み込み
  // =========================================================

  async function loadLanguageLyrics(
    song,
    lang,
    language
  ) {

    const text =
      await loadLyricsText(
        language
      );


    const processed =
      processPreview(
        text,
        song,
        language
      );


    return {

      lang,

      name:
        getLanguageLabel(
          lang,
          language
        ),

      html:
        convertLyricsToHTML(
          processed.text
        ),

      locked:
        processed.locked,

      unlockAt:
        processed.unlockAt
    };
  }


  // =========================================================
  // 公開済み言語取得
  // =========================================================

  function getAvailableLanguages(
    song
  ) {

    const languages =
      song.languages || {};


    return Object.entries(
      languages
    ).filter(
      ([lang, language]) => {

        return isPublished(
          language.publish
        );
      }
    );
  }


  // =========================================================
  // モーダル本文生成
  // =========================================================

  function createLyricsPanel(
    result,
    active
  ) {

    const panel =
      document.createElement("div");


    panel.className =
      "lyrics-text";


    panel.dataset.lang =
      result.lang;


    panel.hidden =
      !active;


    panel.classList.toggle(
      "is-active",
      active
    );


    panel.innerHTML =
      result.html;


    if (
      result.locked &&
      result.unlockAt
    ) {

      const note =
        document.createElement(
          "div"
        );


      note.className =
        "ly-preview-note";


      const unlockText =
        formatDate(
          result.unlockAt
        );


      note.textContent =
        unlockText
          ? `この続きの歌詞は ${unlockText} に公開予定です。`
          : "発売前のため、歌詞はここまでの公開です。";


      panel.appendChild(note);
    }


    return panel;
  }


  // =========================================================
  // 言語タブ
  // =========================================================

  function createLanguageTabs(
    lyricsRoot,
    results,
    defaultLang
  ) {

    if (
      results.length <= 1
    ) {
      return;
    }


    const tabs =
      document.createElement(
        "div"
      );


    tabs.className =
      "lyrics-lang-tabs";


    tabs.setAttribute(
      "role",
      "tablist"
    );


    tabs.setAttribute(
      "aria-label",
      "歌詞の言語切り替え"
    );


    function activate(
      lang
    ) {

      tabs
        .querySelectorAll(
          ".lyrics-lang-tab"
        )
        .forEach(button => {

          const active =
            button.dataset.langTab ===
            lang;


          button.classList.toggle(
            "is-active",
            active
          );


          button.setAttribute(
            "aria-selected",
            String(active)
          );
        });


      lyricsRoot
        .querySelectorAll(
          ".lyrics-text[data-lang]"
        )
        .forEach(panel => {

          const active =
            panel.dataset.lang ===
            lang;


          panel.hidden =
            !active;


          panel.classList.toggle(
            "is-active",
            active
          );
        });
    }


    results.forEach(
      result => {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "lyrics-lang-tab";


        button.dataset.langTab =
          result.lang;


        button.setAttribute(
          "role",
          "tab"
        );


        button.setAttribute(
          "aria-selected",
          "false"
        );


        button.textContent =
          result.name;


        button.addEventListener(
          "click",
          () => {

            activate(
              result.lang
            );
          }
        );


        tabs.appendChild(
          button
        );
      }
    );


    lyricsRoot.insertBefore(
      tabs,
      lyricsRoot.firstChild
    );


    activate(
      defaultLang
    );
  }


  // =========================================================
  // 曲読み込み
  // =========================================================

  async function loadSongLyrics(
    songId
  ) {

    const songs =
      await loadSongs();


    const song =
      songs[songId];


    if (!song) {

      throw new Error(
        `曲データが見つかりません: ${songId}`
      );
    }


    // ページ自体が未公開
    if (
      song.publish?.page &&
      !isPublished(
        song.publish.page
      )
    ) {

      throw new Error(
        "この歌詞はまだ公開されていません。"
      );
    }


    const languages =
      getAvailableLanguages(
        song
      );


    if (
      languages.length === 0
    ) {

      throw new Error(
        "公開中の歌詞がありません。"
      );
    }


    const results =
      await Promise.all(
        languages.map(
          ([lang, language]) =>

            loadLanguageLyrics(
              song,
              lang,
              language
            )
        )
      );


    return {
      song,
      results
    };
  }


  // =========================================================
  // 歌詞表示
  // =========================================================

  async function showLyrics(
    songId
  ) {

    body.innerHTML =
      `<div class="ly-loading">読み込み中…</div>`;


    titleEl.textContent =
      "歌詞";


    openEl.hidden =
      true;


    openModal();


    try {

      const {
        song,
        results
      } =
        await loadSongLyrics(
          songId
        );


      // タイトル
      titleEl.textContent =
        song.title || "歌詞";


      // =====================================================
      // 全文ページ
      // =====================================================

      openEl.hidden =
        false;


      openEl.href =
        new URL(
          `${LYRICS_PAGE_URL}?s=${encodeURIComponent(songId)}`,
          location.href
        ).toString();


      // =====================================================
      // 歌詞
      // =====================================================

      body.innerHTML = "";


      // =====================================================
      // 曲情報
      // =====================================================

      const songInfo =
        createSongInfo(song);

      body.appendChild(
        songInfo
      );

      // =====================================================
      // 区切り線
      // =====================================================

      const hr =
        document.createElement("hr");

      hr.className =
        "ly-song-divider";

      body.appendChild(
        hr
      );


      // =====================================================
      // 歌詞
      // =====================================================

      const lyricsRoot =
        document.createElement(
          "div"
        );


      lyricsRoot.className =
        "lyrics";


      // 日本語を優先
      const defaultResult =
        results.find(
          result =>
            result.lang === "ja"
        )
        ||
        results[0];


      results.forEach(
        result => {

          const panel =
            createLyricsPanel(
              result,
              result.lang ===
                defaultResult.lang
            );


          lyricsRoot.appendChild(
            panel
          );
        }
      );


      body.appendChild(
        lyricsRoot
      );


      // 言語タブ
      createLanguageTabs(
        lyricsRoot,
        results,
        defaultResult.lang
      );


      // 既存の歌詞ロック処理がある場合
      if (
        typeof window.setupLyricLocks ===
        "function"
      ) {

        window.setupLyricLocks(
          body,
          song.title
        );
      }


    } catch (error) {

      console.error(
        "[lyrics-modal]",
        error
      );


      body.innerHTML = `
        <div class="ly-error">
          歌詞の読み込みに失敗しました。<br>
          <small>${escapeHTML(error.message)}</small>
        </div>
      `;
    }
  }


  // =========================================================
  // ボタン
  // =========================================================

  document
    .querySelectorAll(
      ".lyrics-btn[data-song-id]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const songId =
              button.dataset.songId;


            if (!songId) {
              return;
            }


            showLyrics(
              songId
            );
          }
        );
      }
    );

});