// ===== 設定 =====
const DATA_URL = "https://oecusoundserver.github.io/Cadence/data.json"; // ←あなたのJSONパスに変更OK
const COLUMNS = ["型番","アルバム名","曲名","原曲名","番号","アーティスト名","発行日"];

let RAW = [];   // 元データ
let VIEW = [];  // 表示用
let sortKey = null;   // 現在のソート列（日本語キー）
let sortDir = 1;      // 1:昇順 / -1:降順

// ユーティリティ
const esc = (s="") => String(s).replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const nfkc = (s="") => s.normalize("NFKC").toLowerCase(); // 全角半角ゆらぎ対策 + 大文字小文字無視
const isDateKey = (k) => k === "発行日";
const parseDate = (v) => {
  // "YYYY-MM-DD" だけでなく "YYYY/M/D" なども一応吸収
  if (!v) return null;
  const t = (""+v).replace(/\./g,"/").replace(/-/g,"/"); 
  const d = new Date(t);
  return isNaN(d) ? null : d;
};
const fmtDate = (v) => {
  const d = parseDate(v);
  if (!d) return esc(v||"");
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
};
const regEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 描画
function renderTable() {
  const $table = document.getElementById("albumTable");
  if (!$table) return;

  // ヘッダー
  let thead = `<thead><tr>`;
  COLUMNS.forEach(k => {
    const isActive = sortKey === k;
    const icon = !isActive ? "fa-sort" : (sortDir===1?"fa-sort-up":"fa-sort-down");
    thead += `<th data-key="${esc(k)}">${esc(k)} <i class="fa-solid ${icon}"></i></th>`;
  });
  thead += `</tr></thead>`;

  // 検索語のハイライト
  const q = nfkc(document.getElementById("searchInput")?.value || "");
  const hi = (text="") => {
    if (!q) return esc(text);
    const raw = String(text);
    // 可視文字列用にそのまま highlight（NFKCハイライトは過剰なのでここは素直に一致ハイライト）
    try {
      const re = new RegExp(regEsc(textMatchTarget(raw, q)), "gi");
      // 見つけやすさ重視：素の raw から一致箇所をハイライト
      return esc(raw).replace(new RegExp(regEsc(q), "gi"), m => `<span class="highlight">${esc(m)}</span>`);
    } catch {
      return esc(raw);
    }
  };
  // ↑簡素版。厳密な NFKC 対応ハイライトは実装が重いので、検索はNFKC、表示は素テキストに対して軽量ハイライト。

  // 行
  let tbody = `<tbody>`;
  VIEW.forEach(row => {
    tbody += `<tr>`;
    COLUMNS.forEach(k => {
      if (k === "発行日") {
        const disp = fmtDate(row[k]);
        // 発行日も検索語があれば軽くハイライト（表記は YYYY/MM/DD）
        tbody += `<td>${q ? disp.replace(new RegExp(regEsc(q),"gi"), m=>`<span class="highlight">${esc(m)}</span>`) : disp}</td>`;
      } else {
        tbody += `<td>${hi(row[k])}</td>`;
      }
    });
    tbody += `</tr>`;
  });
  tbody += `</tbody>`;

  $table.innerHTML = thead + tbody;

  // ソートイベント付与
  $table.querySelectorAll("th").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      if (sortKey === key) {
        sortDir *= -1;
      } else {
        sortKey = key;
        sortDir = 1;
      }
      applySort();
      renderTable();
    });
  });
}

function textMatchTarget(raw, qNorm) {
  // ハイライト元を作るためのヘルパー（簡易）
  // 検索対象は NFKC 化して照合するが、ハイライトは raw に対して q をそのまま当てると崩れにくい
  return qNorm; 
}

// 並べ替え
function applySort() {
  if (!sortKey) return;
  VIEW.sort((a,b) => {
    if (isDateKey(sortKey)) {
      const ad = parseDate(a[sortKey]); const bd = parseDate(b[sortKey]);
      const an = ad ? ad.getTime() : -Infinity;
      const bn = bd ? bd.getTime() : -Infinity;
      return (an - bn) * sortDir;
    }
    // 日本語比較
    const av = String(a[sortKey] ?? "");
    const bv = String(b[sortKey] ?? "");
    return av.localeCompare(bv, "ja") * sortDir;
  });
}

// 検索
function searchData() {
  const q = nfkc(document.getElementById("searchInput").value || "");
  if (!q) {
    VIEW = [...RAW];
    applySort();
    renderTable();
    return;
  }
  VIEW = RAW.filter(row => {
    const hay = COLUMNS.map(k => nfkc(String(row[k] ?? ""))).join(" ");
    return hay.includes(q);
  });
  applySort();
  renderTable();
}

// 初期化
async function initAlbumList() {
  try {
    const res = await fetch(DATA_URL, { cache:"no-store" });
    if (!res.ok) throw new Error("failed to load json");
    const data = await res.json();

    // 想定外キーでもとりあえず拾えるように補完
    RAW = data.map(it => {
      const o = {};
      COLUMNS.forEach(k => o[k] = it[k] ?? "");
      return o;
    });

    // 既定：発行日降順 → 曲名昇順
    sortKey = "発行日"; sortDir = 1;
    VIEW = [...RAW];
    applySort();
    renderTable();
  } catch (e) {
    console.error(e);
    const $table = document.getElementById("albumTable");
    if ($table) $table.innerHTML = `<tbody><tr><td>データを取得できませんでした。</td></tr></tbody>`;
  }
}

document.addEventListener("DOMContentLoaded", initAlbumList);