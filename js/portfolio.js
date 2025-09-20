// ===== 設定 =====
const DATA_URL = "./data.json";
const PAGE_SIZE = 12; // 1ページの件数

// 要素
const $targets = document.querySelector(".targets");
const $pager = document.getElementById("pager");
const $selectedCategory = document.getElementById("selectedCategory");
const $selectedTagCount = document.getElementById("selectedTagCount");
const $catRadios = document.querySelectorAll('input[name="categories"]');

const LABELS = {
  All: "All",
  sound: "サウンド",
  event: "イベント",
  movie: "映像",
  game: "ゲーム",
  other: "その他",
  booth: "BOOTH",
  discontinued: "在庫切れ",
  free: "無料・特典",
  cd: "CD",
  card: "ポストカード",
  sticker: "ステッカー",
  keyring: "アクリルグッズ",
  blog: "ブログ",
  oshinagaki: "お品書き",
  entertainment: "エンタメ",
};

let ALL = [];
let view = { list: [], page: 1, cat: "All" };

init();

async function init() {
  if (!$targets) return;
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("failed to load data.json");
    ALL = await res.json();
    // デフォは新しい順
    ALL.sort((a, b) => new Date(b.date) - new Date(a.date));
    // クエリから状態復元
    applyQuery();
    renderAll();
    // カテゴリ変更
    $catRadios.forEach((r) => {
      r.addEventListener("change", () => {
        view.cat = r.value || "All";
        view.page = 1;
        syncQuery();
        renderAll();
      });
    });
    // ページャ
    $pager?.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-page]");
      if (!b) return;
      view.page = +b.dataset.page;
      syncQuery(false);
      renderList();
      scrollToTargets();
    });
  } catch (err) {
    console.error(err);
    $targets.innerHTML = "<li><p>作品データを読み込めませんでした。</p></li>";
  }
}

function applyQuery() {
  const u = new URL(location.href);
  const cat = u.searchParams.get("cat") || "All";
  const page = +(u.searchParams.get("page") || 1);
  view.cat = cat;
  view.page = Math.max(1, page);
  // ラジオも同期
  const radio =
    [...$catRadios].find((r) => r.value === cat) ||
    [...$catRadios].find((r) => r.id === "All");
  radio && (radio.checked = true);
}

function syncQuery(includeCat = true) {
  const u = new URL(location.href);
  if (includeCat) {
    view.cat && view.cat !== "All"
      ? u.searchParams.set("cat", view.cat)
      : u.searchParams.delete("cat");
  }
  u.searchParams.set("page", view.page);
  history.replaceState(null, "", u.toString());
}

function renderAll() {
  // フィルタ
  let list = ALL;
  if (view.cat && view.cat !== "All") {
    list = list.filter((item) => (item.categories || []).includes(view.cat));
  }
  view.list = list;

  // 見出しの件数
  const label = LABELS[view.cat] || view.cat;
  $selectedCategory && ($selectedCategory.textContent = label);
  $selectedTagCount && ($selectedTagCount.textContent = String(list.length));

  // ページの範囲
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (view.page > pages) view.page = pages;

  renderList();
  renderPager(pages);
}

function renderList() {
  const start = (view.page - 1) * PAGE_SIZE;
  const items = view.list.slice(start, start + PAGE_SIZE);
  $targets.innerHTML =
    items.map(toTargetHTML).join("") ||
    "<li><p>該当する作品がありません。</p></li>";
}

function renderPager(pages) {
  if (!$pager) return;
  if (pages <= 1) {
    $pager.innerHTML = "";
    return;
  }
  let html = "";
  for (let p = 1; p <= pages; p++) {
    const active = p === view.page ? " is-active" : ""; // ← active → is-active に
    html += `
      <button class="page-btn${active}" data-page="${p}" aria-label="ページ ${p}">
        <i class="fas fa-paw" aria-hidden="true"></i>
        <span class="num">${p}</span>
      </button>
    `;
  }
  $pager.innerHTML = html;
}


function toTargetHTML(item) {
  // figure > overlay（既存クラス）を踏襲
  const cats = (item.categories || []).join(" ");
  const timeISO = item.date
    ? `      <time datetime="${item.date}"></time>\n`
    : "";
  const labels = (item.categories || [])
    .map((cat) => {
      const cls = labelClass(cat); // 既存の色分けをほどほどに再現
      const ja = LABELS[cat] || cat;
      return `<li><strong class="${cls}" data-category="${cat}" onclick="document.getElementById('${cat}').click();"><i class="fas fa-hashtag"></i>${ja}</strong></li>`;
    })
    .join("");

  const btns = (item.buttons || [])
    .map((b) => {
      const klass = b.class || "button button-3d button-mini button-rounded";
      return `<a href="${esc(
        b.href
      )}" class="${klass}" style="color:#fff;">${esc(b.label)}</a>`;
    })
    .join("\n        ");

  const squareWrapStart = item.squareImage
    ? '<div class="portfolio-overlay square-image">'
    : '<div class="portfolio-overlay">';
  const captions = (item.captions || [])
    .map((c) => `<figcaption>${esc(c)}</figcaption>`)
    .join("\n        ");

  return `
<li class="target" data-category="${esc(cats)}">
  <figure>
    ${squareWrapStart}
      <a href="${esc(item.href || "#")}"> <img src="${esc(
    item.image || "../img/yellow.png"
  )}" alt=""> </a>
      <div class="hover-mask">
        <p>
          <div class="circle">
            <h2><a href="${esc(
              item.fullImage || item.image || "../img/yellow.png"
            )}"><i class="fa fa-plus"></i></a></h2>
          </div>
          <div class="circle">
            <h2><a href="${esc(
              item.href || "#"
            )}"><i class="fa fa-bars"></i></a></h2>
          </div>
        </p>
      </div>
    </div>
    ${
      btns
        ? `
    ${btns}
    `
        : ""
    }
    <h2 class="target-title"> <a href="${esc(item.href || "#")}">${esc(
    item.title || "作品名"
  )}</a> </h2>
    <ol class="target-categories">
      ${labels}
${timeISO}    </ol>
    ${captions}
  </figure>
</li>`.trim();
}

function labelClass(cat) {
  // 既存の色分け：primary/success/warning/danger/default をカテゴリごとに割当
  if (cat === "sound") return "label label-primary";
  if (cat === "game") return "label label-success";
  if (cat === "movie") return "label label-warning";
  if (cat === "event") return "label label-danger";
  return "label label-default";
}

function esc(s) {
  return (s || "")
    .toString()
    .replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
}

function scrollToTargets() {
  const el = document.querySelector(".gallery") || $targets;
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function pinFirst(list) {
  // pin:true のアイテムを探す
  const i = list.findIndex(item => item.pin);
  if (i > 0) {
    const [picked] = list.splice(i, 1);
    list.unshift(picked);
  }
  return list;
}

function renderAll() {
  // フィルタ
  let list = ALL;
  if (view.cat && view.cat !== "All") {
    list = list.filter((item) => (item.categories || []).includes(view.cat));
  }

  // ★ Allカテゴリのときだけpinを先頭に
  if (view.cat === "All") {
    pinFirst(list);
  }

  view.list = list;

  // 件数やページ計算
  const label = LABELS[view.cat] || view.cat;
  $selectedCategory && ($selectedCategory.textContent = label);
  $selectedTagCount && ($selectedTagCount.textContent = String(list.length));

  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (view.page > pages) view.page = pages;

  renderList();
  renderPager(pages);
}
