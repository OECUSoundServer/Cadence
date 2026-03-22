document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("lyrics-list");
  const cards = Array.from(document.querySelectorAll(".lyrics-card"));

  const searchInput = document.getElementById("lyrics-search");
  const lyricistFilter = document.getElementById("lyricist-filter");
  const languageFilter = document.getElementById("language-filter");
  const mvFilter = document.getElementById("mv-filter");
  const sortOrder = document.getElementById("sort-order");

  const emptyMessage = document.getElementById("lyrics-empty");
  const countLabel = document.getElementById("lyrics-count");
  const tagFilter = document.getElementById("tag-filter");

  const activeTags = new Set();

  if (!list || cards.length === 0) return;

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
      lyricsUrl: ds.lyricsUrl || "",
    };
  }

  async function loadLyricsPreview(card) {
    const data = getCardData(card);
    const preview = card.querySelector(".lyrics-preview");
    const maxLines = Number(preview?.dataset.lines || 3);

    if (!data.lyricsUrl || !preview) return;

    try {
      const response = await fetch(data.lyricsUrl, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const lyricsElement =
        doc.querySelector('.lyrics-lang[data-lang="ja"]') ||
        doc.querySelector(".lyrics-text");

      if (!lyricsElement) {
        preview.textContent = "歌詞を取得できませんでした。";
        return;
      }

      const temp = lyricsElement.cloneNode(true);

      temp.querySelectorAll("rt").forEach((el) => el.remove());
      temp.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));

      const lines = (temp.textContent || "")
        .split("\n")
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter((line) => line !== "");

      if (lines.length === 0) {
        preview.textContent = "歌詞が見つかりませんでした。";
        return;
      }

      preview.innerHTML = lines.slice(0, maxLines).join("<br>");
    } catch (error) {
      console.error("歌詞取得エラー:", data.lyricsUrl, error);
      preview.textContent = "歌詞の読み込みに失敗しました。";
    }
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

  await Promise.all(cards.map((card) => loadLyricsPreview(card)));

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
