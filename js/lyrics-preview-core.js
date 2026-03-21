window.LyricsPreview = (() => {
  const DEFAULT_UNLOCK_AT = "2026-05-04T00:00:00+09:00";

  function parseTime(value) {
    if (!value) return null;
    const t = new Date(value).getTime();
    return Number.isNaN(t) ? null : t;
  }

  function isUnlocked(unlockAt) {
    const t = parseTime(unlockAt || DEFAULT_UNLOCK_AT);
    if (t == null) return true;
    return Date.now() >= t;
  }

  function formatUnlock(unlockAt) {
    const t = parseTime(unlockAt || DEFAULT_UNLOCK_AT);
    if (t == null) return "";
    const d = new Date(t);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
  }

  function apply(root, options = {}) {
    if (!root) return;

    const unlockAt = options.unlockAt || root.dataset.lyricsUnlock || "";
    const previewMode = options.previewMode || root.dataset.lyricsPreview || "cut";

    if (previewMode === "full" || isUnlocked(unlockAt)) return;

    const cut = root.querySelector(".lyrics-cut");
    if (!cut) return;

    let node = cut.nextSibling;
    while (node) {
      const next = node.nextSibling;
      if (node.nodeType === Node.ELEMENT_NODE) {
        node.classList.add("lyrics-cut-hidden");
      } else if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = "";
      }
      node = next;
    }

    cut.classList.add("lyrics-cut-hidden");
    root.classList.add("lyrics-preview-fade");

    if (!root.parentElement?.classList.contains("lyrics-preview-wrap")) {
      const wrap = document.createElement("div");
      wrap.className = "lyrics-preview-wrap";
      root.parentNode.insertBefore(wrap, root);
      wrap.appendChild(root);

      const note = document.createElement("div");
      note.className = "ly-preview-note";
      const unlockText = formatUnlock(unlockAt);
      note.textContent = unlockText
        ? `この続きの歌詞は ${unlockText} に公開予定です。`
        : "この続きの歌詞は後日公開予定です。";
      wrap.appendChild(note);
    }
  }

  return { apply, isUnlocked };
})();