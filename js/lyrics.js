document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("lyrics-list");
  const cards = Array.from(document.querySelectorAll(".lyrics-card"));
  const searchInput = document.getElementById("lyrics-search");
  const lyricistFilter = document.getElementById("lyricist-filter");
  const sortOrder = document.getElementById("sort-order");
  const emptyMessage = document.getElementById("lyrics-empty");
  const countLabel = document.getElementById("lyrics-count");

  async function loadLyricsPreview(card) {
    const url = card.dataset.lyricsUrl;
    const preview = card.querySelector(".lyrics-preview");
    const maxLines = Number(preview?.dataset.lines || 3);

    if (!url || !preview) return;

    try {
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const lyricsElement = doc.querySelector(".lyrics-text");

      if (!lyricsElement) {
        preview.textContent = "歌詞を取得できませんでした。";
        return;
      }

      const temp = lyricsElement.cloneNode(true);

      // ルビの読みを除去
      temp.querySelectorAll("rt").forEach(el => el.remove());

      // br → 改行
      temp.querySelectorAll("br").forEach(br => br.replaceWith("\n"));

      const lines = (temp.textContent || "")
        .split("\n")
        .map(line => line.replace(/\s+/g, " ").trim())
        .filter(line => line !== "");

      if (lines.length === 0) {
        preview.textContent = "歌詞が見つかりませんでした。";
        return;
      }

      preview.innerHTML = lines.slice(0, maxLines).join("<br>");
    } catch (error) {
      console.error("歌詞取得エラー:", url, error);
      preview.textContent = "歌詞の読み込みに失敗しました。";
    }
  }

  function buildLyricistOptions() {
    const lyricists = [...new Set(
      cards.map(card => (card.dataset.lyricist || "").trim()).filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "ja"));

    lyricists.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      lyricistFilter.appendChild(option);
    });
  }

  function getSearchTarget(card) {
    return [
      card.dataset.title || "",
      card.dataset.lyricist || "",
      card.dataset.arranger || "",
      card.dataset.vocal || "",
      card.dataset.release || "",
      card.dataset.year || "",
      card.dataset.event || ""
    ].join(" ").toLowerCase();
  }

  function sortCards(filteredCards) {
    const order = sortOrder.value;

    filteredCards.sort((a, b) => {
      if (order === "year-desc") {
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      }

      if (order === "year-asc") {
        return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
      }

      if (order === "title-asc") {
        return (a.dataset.title || "").localeCompare((b.dataset.title || ""), "ja");
      }

      return 0;
    });
  }

  function updateList() {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedLyricist = lyricistFilter.value;

    const filteredCards = cards.filter(card => {
      const matchesKeyword = !keyword || getSearchTarget(card).includes(keyword);
      const matchesLyricist =
        !selectedLyricist || (card.dataset.lyricist || "") === selectedLyricist;

      return matchesKeyword && matchesLyricist;
    });

    sortCards(filteredCards);

    list.innerHTML = "";
    filteredCards.forEach(card => list.appendChild(card));

    countLabel.textContent = `${filteredCards.length}件表示中`;
    emptyMessage.hidden = filteredCards.length !== 0;
  }

  buildLyricistOptions();

  await Promise.all(cards.map(card => loadLyricsPreview(card)));

  updateList();

  searchInput.addEventListener("input", updateList);
  lyricistFilter.addEventListener("change", updateList);
  sortOrder.addEventListener("change", updateList);
});
