/*! lyrics-modal v3 - per-track unlock support */
document.addEventListener("DOMContentLoaded", () => {
  // 必要なら全体の既定公開日時
  const DEFAULT_UNLOCK_AT = "2026-08-15T00:00:00+09:00";

  // ---- modal skeleton ----
  const modal = document.createElement("div");
  modal.id = "lyrics-modal";
  modal.innerHTML = `
    <div class="ly-overlay" aria-hidden="true"></div>
    <div class="ly-dialog" role="dialog" aria-modal="true" aria-labelledby="ly-title">
      <div class="ly-head">
        <h3 id="ly-title" class="ly-title"></h3>
        <div class="ly-actions">
          <a class="ly-open" target="_blank" rel="noopener" hidden>全文を開く</a>
          <button class="ly-close" aria-label="閉じる">×</button>
        </div>
      </div>
      <div class="ly-body"><div class="ly-loading">読み込み中…</div></div>
    </div>`;
  document.body.appendChild(modal);

  const overlay = modal.querySelector(".ly-overlay");
  const body    = modal.querySelector(".ly-body");
  const titleEl = modal.querySelector(".ly-title");
  const openEl  = modal.querySelector(".ly-open");
  const closeEl = modal.querySelector(".ly-close");

  function openModal() {
    modal.classList.add("open");
    document.body.classList.add("modal-locked");
    setTimeout(() => closeEl.focus(), 0);
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-locked");
    body.innerHTML = "";
    titleEl.textContent = "";
    openEl.hidden = true;
    openEl.removeAttribute("href");
  }

  overlay.addEventListener("click", closeModal);
  closeEl.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  function autoSelector(doc, prefer) {
    if (prefer && doc.querySelector(prefer)) return prefer;
    const cands = [
      prefer,
      "[data-lyrics]",
      ".lyrics-content",
      "#lyrics",
      "article .lyrics",
      "main .lyrics"
    ].filter(Boolean);

    for (const sel of cands) {
      if (doc.querySelector(sel)) return sel;
    }
    return null;
  }

  async function fetchFragment(url, selector) {
    const u = new URL(url, location.href);
    u.searchParams.set("_t", Date.now());

    const res = await fetch(u.toString(), { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const doc  = new DOMParser().parseFromString(html, "text/html");
    const sel  = autoSelector(doc, selector);
    if (!sel) return { html: null, selector: null };

    const node = doc.querySelector(sel);
    return { html: node.innerHTML, selector: sel };
  }

  function parseUnlockTime(value) {
    if (!value) return null;
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  }

  function isLyricsUnlocked(unlockAtValue) {
    const unlockTime =
      parseUnlockTime(unlockAtValue) ??
      parseUnlockTime(DEFAULT_UNLOCK_AT);

    if (unlockTime == null) return true;
    return Date.now() >= unlockTime;
  }

  function formatUnlockText(unlockAtValue) {
    const unlockTime =
      parseUnlockTime(unlockAtValue) ??
      parseUnlockTime(DEFAULT_UNLOCK_AT);

    if (unlockTime == null) return "";

    const d = new Date(unlockTime);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");

    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
  }

  function applyLyricsPreview(container, unlockAtValue) {
    const lyricsRoot = container.querySelector(".lyrics");
    if (!lyricsRoot) return;

    const cut = lyricsRoot.querySelector(".lyrics-cut");
    if (!cut) return;

    // カット以降を隠す
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
    lyricsRoot.classList.add("lyrics-preview-fade");

    const note = document.createElement("div");
    note.className = "ly-preview-note";

    const unlockText = formatUnlockText(unlockAtValue);
    note.textContent = unlockText
      ? `この続きの歌詞は ${unlockText} に公開予定です。`
      : "発売前のため、歌詞はここまでの公開です。";

    const wrap = document.createElement("div");
    wrap.className = "lyrics-preview-wrap";

    lyricsRoot.parentNode.insertBefore(wrap, lyricsRoot);
    wrap.appendChild(lyricsRoot);
    wrap.appendChild(note);
  }

  function appendFullViewButton(container, fullUrl) {
    if (!fullUrl) return;

    const wrap = document.createElement("div");
    wrap.className = "ly-fullview-wrap";

    const link = document.createElement("a");
    link.className = "ly-fullview-btn";
    link.href = new URL(fullUrl, location.href).toString();
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "全文を見る";

    wrap.appendChild(link);
    container.appendChild(wrap);
  }

  document.querySelectorAll(".lyrics-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const src   = btn.dataset.lyricsSrc;
      const sel   = btn.dataset.lyricsSelector;
      const head  =
        btn.dataset.lyricsTitle ||
        btn.closest(".list-group-item")?.querySelector("h4")?.textContent?.trim() ||
        "歌詞";

      const full         = btn.dataset.lyricsUrl || src;
      const previewMode  = btn.dataset.lyricsPreview; // 未指定は未指定のまま扱う
      const unlockAt     = btn.dataset.lyricsUnlock || "";
      const unlocked     = isLyricsUnlocked(unlockAt);
      const shouldPreview = previewMode === "cut" && !unlocked;

      titleEl.textContent = head;
      body.innerHTML = `<div class="ly-loading">読み込み中…</div>`;
      openModal();

      try {
        const { html } = await fetchFragment(src, sel);

        if (!html) {
          body.innerHTML = `
            <div class="ly-error">
              指定の要素が見つかりませんでした。<br>
              <small>selector: ${sel || "(auto)"}</small>
            </div>`;
          return;
        }

        // ヘッダーの「全文を開く」：
        // preview未指定 または previewMode=full の時だけ表示
        if (full && (!previewMode || previewMode === "full")) {
          openEl.hidden = false;
          openEl.href = new URL(full, location.href).toString();
        } else {
          openEl.hidden = true;
          openEl.removeAttribute("href");
        }

        body.innerHTML = `<div class="lyrics">${html}</div>`;

        if (shouldPreview) {
          applyLyricsPreview(body, unlockAt);
        }

        if (typeof window.setupLyricLocks === "function") {
          setupLyricLocks(body, head);
        }

        // 本文下の「全文を見る」：
        // preview未指定 または previewMode=full の時だけ表示
        if (full && (!previewMode || previewMode === "full")) {
          appendFullViewButton(body, full);
        }
      } catch (e) {
        console.error("[lyrics-modal]", e);
        body.innerHTML = `
          <div class="ly-error">
            歌詞の読み込みに失敗しました。<br>
            <small>${e.message}</small>
          </div>`;
      }
    });
  });
});