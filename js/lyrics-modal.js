/*! lyrics-modal v5 - button-controlled languages + per-track unlock support */
document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_UNLOCK_AT = "2026-08-15T00:00:00+09:00";

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
  const body = modal.querySelector(".ly-body");
  const titleEl = modal.querySelector(".ly-title");
  const openEl = modal.querySelector(".ly-open");
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
    delete body.dataset.previewMode;
    delete body.dataset.unlockAt;
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
      "main .lyrics",
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
    const doc = new DOMParser().parseFromString(html, "text/html");
    const sel = autoSelector(doc, selector);
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

  function getLanguageLabel(code) {
    if (!code) return "";

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
      it: "Italiano",
    };

    const normalized = String(code).trim().toLowerCase();

    if (custom[normalized]) return custom[normalized];

    try {
      return (
        new Intl.DisplayNames(["ja"], { type: "language" }).of(normalized) ||
        normalized
      );
    } catch {
      return normalized;
    }
  }

  function parseLangList(value) {
    return String(value || "")
      .split(/[,\s]+/)
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
  }

  function getActiveLyricsPanel(container) {
    const lyricsRoot = container.querySelector(".lyrics");
    if (!lyricsRoot) return null;

    return (
      lyricsRoot.querySelector(
        ".lyrics-lang[data-lang].is-active, .lyrics-text[data-lang].is-active"
      ) ||
      lyricsRoot.querySelector(
        '.lyrics-lang[data-lang]:not([hidden]), .lyrics-text[data-lang]:not([hidden])'
      ) ||
      lyricsRoot
    );
  }

  function applyPreviewToPanel(panel) {
    if (!panel) return;
    if (panel.dataset.lyricsPreviewApplied === "true") return;

    const cut = panel.querySelector(".lyrics-cut");
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
    panel.classList.add("lyrics-preview-fade");
    panel.dataset.lyricsPreviewApplied = "true";

    if (!panel.parentElement?.classList.contains("lyrics-preview-wrap")) {
      const wrap = document.createElement("div");
      wrap.className = "lyrics-preview-wrap";
      panel.parentNode.insertBefore(wrap, panel);
      wrap.appendChild(panel);
    }
  }

  function renderPreviewNote(container, unlockAtValue) {
    container.querySelectorAll(".ly-preview-note").forEach((el) => el.remove());

    const activePanel = getActiveLyricsPanel(container);
    if (!activePanel) return;

    const note = document.createElement("div");
    note.className = "ly-preview-note";

    const unlockText = formatUnlockText(unlockAtValue);
    note.textContent = unlockText
      ? `この続きの歌詞は ${unlockText} に公開予定です。`
      : "発売前のため、歌詞はここまでの公開です。";

    const anchor =
      activePanel.parentElement?.classList.contains("lyrics-preview-wrap")
        ? activePanel.parentElement
        : activePanel;

    anchor.insertAdjacentElement("afterend", note);
  }

  function applyLyricsPreview(container, unlockAtValue) {
    const activePanel = getActiveLyricsPanel(container);
    if (!activePanel) return;

    applyPreviewToPanel(activePanel);
    renderPreviewNote(container, unlockAtValue);
  }

  function setupModalLanguageTabs(container, options = {}) {
    const defaultLang = String(options.defaultLang || "ja").toLowerCase();
    const allowedLangs = parseLangList(options.allowedLangs);

    const lyricsRoot = container.querySelector(".lyrics");
    if (!lyricsRoot) return;

    // ページ側の既存タブはモーダルでは使わない
    lyricsRoot
      .querySelectorAll(".lang-switch, .lang-tabs, [data-role='lang-switch']")
      .forEach((el) => el.remove());

    const allPanels = Array.from(
      lyricsRoot.querySelectorAll(".lyrics-lang[data-lang], .lyrics-text[data-lang]")
    );

    if (!allPanels.length) return;

    const panels = allPanels.filter((panel) => {
      const lang = String(panel.dataset.lang || "").toLowerCase();
      return !allowedLangs.length || allowedLangs.includes(lang);
    });

    // 許可外の言語は隠す
    allPanels.forEach((panel) => {
      const lang = String(panel.dataset.lang || "").toLowerCase();
      const allowed = !allowedLangs.length || allowedLangs.includes(lang);
      panel.hidden = !allowed;
      panel.classList.remove("is-active");
    });

    if (!panels.length) {
      // 指定言語が1つも無ければ先頭を表示
      const fallback = allPanels[0];
      if (fallback) {
        fallback.hidden = false;
        fallback.classList.add("is-active");
      }
      return;
    }

    let tabs = lyricsRoot.querySelector(".lyrics-lang-tabs");
    if (tabs) tabs.remove();

    if (panels.length === 1) {
      panels[0].hidden = false;
      panels[0].classList.add("is-active");
      return;
    }

    tabs = document.createElement("div");
    tabs.className = "lyrics-lang-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "歌詞の言語切り替え");

    function activate(lang) {
      const normalized = String(lang || "").toLowerCase();

      tabs.querySelectorAll(".lyrics-lang-tab").forEach((btn) => {
        const active = btn.dataset.langTab === normalized;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        const panelLang = String(panel.dataset.lang || "").toLowerCase();
        const active = panelLang === normalized;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });

      if (container.dataset.previewMode === "cut") {
        applyLyricsPreview(container, container.dataset.unlockAt || "");
      }
    }

    panels.forEach((panel, index) => {
      const lang = String(panel.dataset.lang || "").toLowerCase();

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lyrics-lang-tab";
      btn.dataset.langTab = lang;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", "false");
      btn.textContent = getLanguageLabel(lang);

      if (!panel.id) {
        panel.id = `lyrics-lang-${lang}-${index}`;
      }

      btn.setAttribute("aria-controls", panel.id);
      btn.addEventListener("click", () => activate(lang));
      tabs.appendChild(btn);
    });

    lyricsRoot.insertBefore(tabs, lyricsRoot.firstChild);

    const hasDefault = panels.some(
      (panel) => String(panel.dataset.lang || "").toLowerCase() === defaultLang
    );

    activate(
      hasDefault
        ? defaultLang
        : String(panels[0].dataset.lang || "").toLowerCase()
    );
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
      const src = btn.dataset.lyricsSrc;
      const sel = btn.dataset.lyricsSelector;
      const head =
        btn.dataset.lyricsTitle ||
        btn.closest(".list-group-item")?.querySelector("h4")?.textContent?.trim() ||
        "歌詞";

      const full = btn.dataset.lyricsUrl || src;
      const previewMode = btn.dataset.lyricsPreview || "";
      const unlockAt = btn.dataset.lyricsUnlock || "";
      const unlocked = isLyricsUnlocked(unlockAt);
      const shouldPreview = previewMode === "cut" && !unlocked;

      const allowedLangs = btn.dataset.lyricsLangs || "";
      const defaultLang = btn.dataset.lyricsDefaultLang || "ja";

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

        if (full && (!previewMode || previewMode === "full")) {
          openEl.hidden = false;
          openEl.href = new URL(full, location.href).toString();
        } else {
          openEl.hidden = true;
          openEl.removeAttribute("href");
        }

        body.innerHTML = `<div class="lyrics">${html}</div>`;
        body.dataset.previewMode = previewMode;
        body.dataset.unlockAt = unlockAt;

        setupModalLanguageTabs(body, {
          allowedLangs,
          defaultLang,
        });

        if (shouldPreview) {
          applyLyricsPreview(body, unlockAt);
        }

        if (typeof window.setupLyricLocks === "function") {
          window.setupLyricLocks(body, head);
        }

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