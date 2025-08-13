/*! lyrics-modal v2 - fetch page & extract fragment by selector + polished UI */
document.addEventListener("DOMContentLoaded", () => {
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
  const dialog  = modal.querySelector(".ly-dialog");
  const body    = modal.querySelector(".ly-body");
  const titleEl = modal.querySelector(".ly-title");
  const openEl  = modal.querySelector(".ly-open");
  const closeEl = modal.querySelector(".ly-close");

  function openModal() {
    modal.classList.add("open");
    document.body.classList.add("modal-locked");
    // フォーカスを閉じるボタンに
    setTimeout(() => closeEl.focus(), 0);
  }
  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-locked");
    body.innerHTML = "";
    titleEl.textContent = "";
    openEl.hidden = true;
  }

  overlay.addEventListener("click", closeModal);
  closeEl.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // ---- main action ----
  function autoSelector(doc, prefer) {
    if (prefer && doc.querySelector(prefer)) return prefer;
    const cands = [prefer, "[data-lyrics]", ".lyrics-content", "#lyrics", "article .lyrics", "main .lyrics"]
      .filter(Boolean);
    for (const sel of cands) {
      const el = doc.querySelector(sel);
      if (el) return sel;
    }
    return null;
  }

  async function fetchFragment(url, selector) {
    // 絶対URL化 & キャッシュ回避
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

  // bind buttons
  document.querySelectorAll(".lyrics-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const src   = btn.dataset.lyricsSrc;
      const sel   = btn.dataset.lyricsSelector;
      const head  = btn.dataset.lyricsTitle || btn.closest(".list-group-item")?.querySelector("h4")?.textContent?.trim() || "歌詞";
      const full  = btn.dataset.lyricsUrl || src;

      titleEl.textContent = head;
      body.innerHTML = `<div class="ly-loading">読み込み中…</div>`;
      openModal();

      try {
        const { html, selector } = await fetchFragment(src, sel);
        if (html) {
          openEl.hidden = !full;
          if (full) openEl.href = new URL(full, location.href).toString();
          body.innerHTML = `<div class="lyrics">${html}</div>`;
          if (typeof window.setupLyricLocks === 'function') {
            setupLyricLocks(body, head); // 追加
          }
        } else {
          body.innerHTML = `<div class="ly-error">指定の要素が見つかりませんでした。<br><small>selector: ${sel || "(auto)"}</small></div>`;
        }
      } catch (e) {
        console.error("[lyrics-modal]", e);
        body.innerHTML = `<div class="ly-error">歌詞の読み込みに失敗しました。<br><small>${e.message}</small></div>`;
      }
    });
  });
});
