/*! Cadence Album Nav - same-folder prev/next generator with holes (fixed & title fetch) */
(function () {
  const CONFIG = {
    prefix: "CAD-",
    pad: 4,                 // 0009 の桁数
    holes: [1, 3],          // 欠番
    min: 2,                 // 最初の有効番号
    max: 10,                // 最新番号（新作時に更新）
    injectBefore: "#footer",
    fetchNeighborTitle: true,
    // ページ内の作品名を探す候補（上から優先）
    titleSelectors: [".album-title", "h1 .entry-title", "h1"],
    trimSiteSuffix: true    // 「 | Cadence」「 - Cadence」等の末尾除去
  };

  const q  = (s, r = document) => r.querySelector(s);
  const pad = (n, len) => String(n).padStart(len, "0");
  const basePath = () => location.pathname.replace(/[^/]+$/, "");
  const buildUrl = (n) => `${basePath()}${CONFIG.prefix}${pad(n, CONFIG.pad)}.html`;

  function getCurrentNumber() {
    const m = location.pathname.match(new RegExp(`${CONFIG.prefix}(\\d{${CONFIG.pad}})\\.html$`));
    return m ? parseInt(m[1], 10) : null;
  }
  const isHole = (n) => CONFIG.holes.includes(n);

  function findPrev(curr) { for (let i = curr - 1; i >= CONFIG.min; i--) if (!isHole(i)) return i; return null; }
  function findNext(curr) { for (let i = curr + 1; i <= CONFIG.max; i++) if (!isHole(i)) return i; return null; }

  function tidyTitle(s) {
    if (!s) return s;
    s = s.trim();

    // 先頭の「Cadence｜」または「Cadence -」を削除
    s = s.replace(/^Cadence\s*[｜\|\-–—]\s*/i, "");

    // 末尾の「｜Cadence」または「- Cadence」も削除
    if (CONFIG.trimSiteSuffix) {
        s = s.replace(/\s*[｜\|\-–—]\s*Cadence\s*$/i, "");
    }
    return s.trim();
  }

  async function fetchPrettyTitle(url) {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) return null;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      for (const sel of CONFIG.titleSelectors) {
        const el = doc.querySelector(sel);
        if (el && el.textContent.trim()) return tidyTitle(el.textContent);
      }
      const og = doc.querySelector('meta[property="og:title"]');
      if (og && og.content) return tidyTitle(og.content);
      if (doc.title) return tidyTitle(doc.title);
      return null;
    } catch { return null; }
  }

  function injectStylesOnce() {
    if (q("#album-nav-style")) return;
    const css = `
      .album-nav{
        display:flex;justify-content:space-between;
      }
      .album-nav a{
        flex:1;display:block;padding:.9rem 1rem;
        color:inherit;text-decoration:none;
        transition:background .15s ease, transform .15s ease
      }
      .album-nav a:hover{background:#eee;transform:translateY(-2px)}
      .album-nav .label{display:block;font-size:.85em;opacity:.8}
      .album-nav .title{
        font-weight:600;font-size:1em;margin-top:.2em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis
      }
      .album-nav .disabled{pointer-events:none;opacity:.45}
      @media (prefers-color-scheme: dark){
        .album-nav{border-top-color:rgba(255,255,255,.12);}
        .album-nav a{background:#222;color:#fff;}
        .album-nav a:hover{background:#2a2a2a;}
      }
    `;
    const style = document.createElement("style");
    style.id = "album-nav-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  async function main() {
    const curr = getCurrentNumber();
    if (curr == null) return;

    const prevNum = findPrev(curr);
    const nextNum = findNext(curr);

    const nav  = document.createElement("nav");
    nav.className = "album-nav";

    const prevA = document.createElement("a");
    const nextA = document.createElement("a");

    if (prevNum) {
      prevA.href = buildUrl(prevNum);
      prevA.innerHTML = `<span class="label_nav">← 前の作品</span><span class="title_nav">${CONFIG.prefix}${pad(prevNum, CONFIG.pad)}</span>`;
    } else {
      prevA.className = "disabled";
      prevA.innerHTML = `<span class="label_nav">← 前の作品</span><span class="title_nav">なし</span>`;
    }

    if (nextNum) {
      nextA.href = buildUrl(nextNum);
      nextA.innerHTML = `<span class="label_nav">次の作品 →</span><span class="title_nav">${CONFIG.prefix}${pad(nextNum, CONFIG.pad)}</span>`;
    } else {
      nextA.className = "disabled";
      nextA.innerHTML = `<span class="label_nav">次の作品 →</span><span class="title_nav">なし</span>`;
    }

    nav.appendChild(prevA);
    nav.appendChild(nextA);

    const anchor = CONFIG.injectBefore ? q(CONFIG.injectBefore) : null;
    if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(nav, anchor);
    else document.body.appendChild(nav);

    // タイトル差し替え
    if (CONFIG.fetchNeighborTitle) {
      if (prevNum && prevA.href) {
        const t = await fetchPrettyTitle(prevA.href);
        if (t) prevA.querySelector(".title_nav").textContent = t;
      }
      if (nextNum && nextA.href) {
        const t = await fetchPrettyTitle(nextA.href);
        if (t) nextA.querySelector(".title_nav").textContent = t;
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { injectStylesOnce(); main(); });
  } else {
    injectStylesOnce(); main();
  }
})();
