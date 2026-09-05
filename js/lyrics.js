document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("lyrics-list");

  const searchInput =
    document.getElementById("lyrics-search");

  const lyricistFilter =
    document.getElementById("lyricist-filter");

  const languageFilter =
    document.getElementById("language-filter");

  const mvFilter =
    document.getElementById("mv-filter");

  const sortOrder =
    document.getElementById("sort-order");

  const emptyMessage =
    document.getElementById("lyrics-empty");

  const countLabel =
    document.getElementById("lyrics-count");

  const tagFilter =
    document.getElementById("tag-filter");

  const activeTags = new Set();

  if (!list) return;


  // =========================================================
  // songs.json 読み込み
  // =========================================================

  let songsData = {};

  try {
    songsData = await loadSongsData();
  } catch (error) {
    console.error(
      "songs.json 読み込み失敗:",
      error
    );

    list.textContent =
      "曲データを読み込めませんでした。";

    return;
  }


  // =========================================================
  // カード生成
  // =========================================================

  list.innerHTML = "";

  Object.entries(songsData)
    .forEach(([songId, song]) => {
      const card =
        createLyricsCard(
          songId,
          song
        );

      list.appendChild(card);
    });


  // 生成後に取得
  const cards =
    Array.from(
      document.querySelectorAll(
        ".lyrics-card"
      )
    );


  if (cards.length === 0) return;

  function normalizeText(text) {
    return (text || "").toString().trim().toLowerCase();
  }

  function splitMultiValue(value) {
    return (value || "")
      .split(/[\s,、/＆&|]+/)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  function getLanguageLabel(code) {
    if (!code) return "";

    const map = {
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
      it: "Italiano",
    };

    const normalized = code.toLowerCase();

    if (map[normalized]) {
      return map[normalized];
    }

    // 不明な言語コードはそのまま表示
    // 例: "vi" → "vi"
    return normalized;
  }

  function getCardData(card) {
    const ds = card.dataset;

    return {
      songId: ds.songId || "",
      title: ds.title || "",
      lyricist: ds.lyricist || "",
      arranger: ds.arranger || "",
      vocal: ds.vocal || "",
      release: ds.release || "",
      year: Number(ds.year || 0),
      event: ds.event || "",
      languages: splitMultiValue(ds.languages),
      hasMv: normalizeText(ds.hasMv),
      tags: splitMultiValue(ds.tags),
    };
  }

  async function loadLyricsPreview(card) {
    const data = getCardData(card);

    const preview =
      card.querySelector(".lyrics-preview");

    if (!preview) return;

    const maxLines =
      Number(preview.dataset.lines || 3);


    // =========================================================
    // 曲ID確認
    // =========================================================

    if (!data.songId) {

      preview.textContent =
        "曲IDが設定されていません。";

      return;
    }


    // =========================================================
    // songs.json から曲情報取得
    // =========================================================

    const song =
      songsData[data.songId];

    if (!song) {

      preview.textContent =
        "曲データを取得できませんでした。";

      return;
    }


    // =========================================================
    // 使用言語
    // 日本語優先
    // =========================================================

    const languages =
      song.languages || {};

    const lang =
      languages.ja
        ? "ja"
        : Object.keys(languages)[0];


    if (!lang) {

      preview.textContent =
        "歌詞が登録されていません。";

      return;
    }


    const language =
      languages[lang];


    if (!language?.file) {

      preview.textContent =
        "歌詞ファイルが設定されていません。";

      return;
    }


    // =========================================================
    // 歌詞TXT取得
    // =========================================================

    try {

      const response =
        await fetch(
          language.file,
          {
            cache: "no-store",
          }
        );


      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
        );
      }


      let text =
        await response.text();


      // =========================================================
      // 改行コード統一
      // =========================================================

      text =
        text.replace(
          /\r\n?/g,
          "\n"
        );


      // =========================================================
      // preview-end 以降を一覧に出さない
      // =========================================================

      const previewMarker =
        text.match(
          /^[ \t]*\[preview-end\][ \t]*$/m
        );

      if (previewMarker) {

        text =
          text.substring(
            0,
            previewMarker.index
          );
      }


      // =========================================================
      // ルビ記法
      //
      // {残響|ね}
      // ↓
      // 残響
      // =========================================================

      text =
        text.replace(
          /\{([^{}|]+)\|([^{}]+)\}/g,
          "$1"
        );


      // =========================================================
      // 行単位に変換
      // =========================================================

      const lines =
        text
          .split("\n")
          .map(
            line =>
              line
                .replace(/\s+/g, " ")
                .trim()
          )
          .filter(
            line =>
              line !== ""
          );


      if (lines.length === 0) {

        preview.textContent =
          "歌詞が見つかりませんでした。";

        return;
      }


      // =========================================================
      // 指定行数表示
      // =========================================================

      preview.innerHTML = "";


      const displayLines =
        lines.slice(
          0,
          maxLines
        );


      displayLines.forEach(
        (line, index) => {

          preview.appendChild(
            document.createTextNode(line)
          );


          if (
            index <
            displayLines.length - 1
          ) {

            preview.appendChild(
              document.createElement("br")
            );
          }
        }
      );


    } catch (error) {

      console.error(
        "歌詞取得エラー:",
        language.file,
        error
      );


      preview.textContent =
        "歌詞の読み込みに失敗しました。";
    }
  }

  async function loadSongsData() {
    const response = await fetch("./songs.json", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`songs.json HTTP ${response.status}`);
    }

    return await response.json();
  }

  function createLyricsCard(songId, song) {
    const card = document.createElement("article");
    card.className = "lyrics-card";

    const releaseDate = song.release?.date || "";
    const year = releaseDate
      ? new Date(releaseDate).getFullYear()
      : 0;

    const languages = Object.keys(song.languages || {});
    const hasMv = !!song.video?.url;

    card.dataset.songId = songId;
    card.dataset.title = song.title || "";
    card.dataset.lyricist = joinNames(song.lyricist);
    card.dataset.arranger = joinNames(song.arranger);
    card.dataset.vocal = joinNames(song.vocal);
    card.dataset.release =
      song.release?.catalog ||
      song.release?.title ||
      "";
    card.dataset.year = year;
    card.dataset.event = song.release?.event || "";
    card.dataset.languages = languages.join(" ");
    card.dataset.hasMv = hasMv ? "true" : "false";
    card.dataset.tags = (song.tags || []).join(" ");

    // タイトル
    const title = document.createElement("h3");
    title.textContent = song.title || "無題";
    card.appendChild(title);

    // メタ情報
    const meta = document.createElement("div");
    meta.className = "lyrics-meta";

    if (song.arranger) {
      meta.appendChild(
        createMetaRow(
          "編曲",
          joinNames(song.arranger)
        )
      );
    }

    // 作詞・作曲が同じならまとめる
    if (
      song.composer &&
      song.lyricist &&
      joinNames(song.composer) === joinNames(song.lyricist)
    ) {
      meta.appendChild(
        createMetaRow(
          "作詞・作曲",
          joinNames(song.composer)
        )
      );
    } else {
      if (song.composer) {
        meta.appendChild(
          createMetaRow(
            "作曲",
            joinNames(song.composer)
          )
        );
      }

      if (song.lyricist) {
        meta.appendChild(
          createMetaRow(
            "作詞",
            joinNames(song.lyricist)
          )
        );
      }
    }

    if (song.vocal) {
      meta.appendChild(
        createMetaRow(
          "ボーカル",
          joinNames(song.vocal)
        )
      );
    }

    meta.appendChild(
      createMetaRow(
        "収録",
        song.release?.catalog ||
        song.release?.title ||
        "-"
      )
    );

    const eventText =
      song.release?.event && year
        ? `${song.release.event}（${year}年）`
        : song.release?.event ||
          (year ? `${year}年` : "-");

    meta.appendChild(
      createMetaRow(
        "発表",
        eventText
      )
    );

    card.appendChild(meta);

    // タグ
    const tags = document.createElement("div");
    tags.className = "lyrics-tags";
    card.appendChild(tags);

    // 歌詞プレビュー
    const preview = document.createElement("div");
    preview.className = "lyrics-preview";
    preview.dataset.lines = "4";
    preview.textContent = "読み込み中...";
    card.appendChild(preview);

    // ボタン
    const actions = document.createElement("div");
    actions.className = "lyrics-actions";

    const link = document.createElement("a");
    link.className = "btn primary";
    link.href =
      `./l.html?s=${encodeURIComponent(songId)}`;
    link.textContent = "歌詞ページへ";

    actions.appendChild(link);
    card.appendChild(actions);

    return card;
  }

  function createMetaRow(label, value) {
    const p = document.createElement("p");

    const strong = document.createElement("strong");
    strong.textContent = `${label}:`;

    p.appendChild(strong);

    p.appendChild(
      document.createTextNode(
        ` ${value || "-"}`
      )
    );

    return p;
  }

  function joinNames(value) {
    if (!value) return "";

    if (Array.isArray(value)) {
      return value.join(" & ");
    }

    return value;
  }

  function buildLyricistOptions() {
    if (!lyricistFilter) return;

    const lyricists = [
      ...new Set(
        cards.map((card) => getCardData(card).lyricist.trim()).filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "ja"));

    lyricists.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      lyricistFilter.appendChild(option);
    });
  }

  function buildLanguageOptions() {
    if (!languageFilter || languageFilter.options.length > 1) return;

    const allLanguages = new Set();

    cards.forEach((card) => {
      getCardData(card).languages.forEach((lang) => {
        allLanguages.add(lang);
      });
    });

    [...allLanguages]
      .sort((a, b) => a.localeCompare(b, "ja"))
      .forEach((lang) => {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = getLanguageLabel(lang);
        languageFilter.appendChild(option);
      });
  }

  function getVisualTags(data) {
    const tags = [];

    data.languages.forEach((lang) => {
      tags.push(getLanguageLabel(lang));
    });

    if (data.hasMv === "true") {
      tags.push("MVあり");
    }

    data.tags.forEach((tag) => tags.push(tag));

    return [...new Set(tags)];
  }

  function renderCardTags() {
    cards.forEach((card) => {
      const data = getCardData(card);
      const tagBox = card.querySelector(".lyrics-tags");
      if (!tagBox) return;

      const tags = getVisualTags(data);

      tagBox.innerHTML = tags
        .map((tag) => `<span class="tag-chip">${tag}</span>`)
        .join("");
    });
  }

  function buildTagFilter() {
    if (!tagFilter) return;

    const allTags = new Set();

    cards.forEach((card) => {
      const data = getCardData(card);
      getVisualTags(data).forEach((tag) => allTags.add(tag));
    });

    const sortedTags = [...allTags].sort((a, b) => a.localeCompare(b, "ja"));

    tagFilter.innerHTML = "";

    sortedTags.forEach((tag) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tag-chip";
      button.dataset.tag = tag;
      button.textContent = tag;

      button.addEventListener("click", () => {
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          button.classList.remove("is-active");
        } else {
          activeTags.add(tag);
          button.classList.add("is-active");
        }
        updateList();
      });

      tagFilter.appendChild(button);
    });
  }

  function getSearchTarget(card) {
    const data = getCardData(card);

    return [
      data.title,
      data.lyricist,
      data.arranger,
      data.vocal,
      data.release,
      data.year,
      data.event,
      ...data.languages,
      ...data.languages.map(getLanguageLabel),
      ...(data.hasMv === "true"
        ? ["mv", "動画", "mvあり"]
        : ["mvなし", "動画なし"]),
      ...data.tags,
    ]
      .join(" ")
      .toLowerCase();
  }

  function matchesTagFilter(card) {
    if (activeTags.size === 0) return true;

    const data = getCardData(card);
    const cardTagSet = new Set(getVisualTags(data));

    return [...activeTags].every((tag) => cardTagSet.has(tag));
  }

  function sortCards(filteredCards) {
    const order = sortOrder?.value || "year-desc";

    filteredCards.sort((a, b) => {
      const dataA = getCardData(a);
      const dataB = getCardData(b);

      if (order === "year-desc") {
        return dataB.year - dataA.year;
      }

      if (order === "year-asc") {
        return dataA.year - dataB.year;
      }

      if (order === "title-asc") {
        return dataA.title.localeCompare(dataB.title, "ja");
      }

      return 0;
    });
  }

  function updateList() {
    const keyword = normalizeText(searchInput?.value);
    const selectedLyricist = lyricistFilter?.value || "";
    const selectedLanguage = languageFilter?.value || "";
    const selectedMv = mvFilter?.value || "";

    const filteredCards = cards.filter((card) => {
      const data = getCardData(card);

      const matchesKeyword =
        !keyword || getSearchTarget(card).includes(keyword);

      const matchesLyricist =
        !selectedLyricist || data.lyricist === selectedLyricist;

      const matchesLanguage =
        !selectedLanguage || data.languages.includes(selectedLanguage);

      const matchesMv = !selectedMv || data.hasMv === normalizeText(selectedMv);

      const matchesTags = matchesTagFilter(card);

      return (
        matchesKeyword &&
        matchesLyricist &&
        matchesLanguage &&
        matchesMv &&
        matchesTags
      );
    });

    sortCards(filteredCards);

    list.innerHTML = "";
    filteredCards.forEach((card) => list.appendChild(card));

    if (countLabel) {
      countLabel.textContent = `${filteredCards.length}件表示中`;
    }

    if (emptyMessage) {
      emptyMessage.hidden = filteredCards.length !== 0;
    }
  }

  buildLyricistOptions();
  buildLanguageOptions();
  renderCardTags();
  buildTagFilter();


  // =========================================================
  // songs.json 読み込み
  // =========================================================

  try {

    songsData =
      await loadSongsData();


    // 各カードの歌詞プレビュー読み込み
    await Promise.all(
      cards.map(
        card =>
          loadLyricsPreview(card)
      )
    );


  } catch (error) {

    console.error(
      "songs.json 読み込み失敗:",
      error
    );


    cards.forEach(
      card => {

        const preview =
          card.querySelector(
            ".lyrics-preview"
          );


        if (preview) {

          preview.textContent =
            "曲データを読み込めませんでした。";
        }
      }
    );
  }


  updateList();

  if (searchInput) {
    searchInput.addEventListener("input", updateList);
  }

  if (lyricistFilter) {
    lyricistFilter.addEventListener("change", updateList);
  }

  if (languageFilter) {
    languageFilter.addEventListener("change", updateList);
  }

  if (mvFilter) {
    mvFilter.addEventListener("change", updateList);
  }

  if (sortOrder) {
    sortOrder.addEventListener("change", updateList);
  }
});
