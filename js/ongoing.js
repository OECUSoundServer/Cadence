// ===== 設定 =====
const DATA_URL = "../data/ongoing.json"; // 置き場所に合わせて調整
const $list  = document.getElementById("ongoing-events");
const $empty = document.querySelector("#ongoing-section .no-events");

// XSS対策
function escapeHtml(s = "") {
  return String(s).replace(/[&<>"']/g, c => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]
  ));
}

// ===== カードHTML =====
function toCard(item) {
  const theme = item.theme ? `theme-${item.theme}` : "theme-green";

  // ステータス別バッジ
  let badgeCls = "badge-open", badgeText = "募集中";
  if (item.status === "planned") { badgeCls = "badge-planned"; badgeText = "予告"; }
  if (item.status === "closed")  { badgeCls = "badge-closed";  badgeText = "終了"; }

  // 期日表示（YYYY/MM/DD）
  let deadlineDisp = "";
  if (item.deadline) {
    const d = new Date(item.deadline);
    if (!isNaN(d)) {
      deadlineDisp = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
    }
  }

  const tags = (item.tags || []).map(t => `#${escapeHtml(t)}`).join(" ");

  // カウントダウン（closed以外 かつ deadlineあり）
  const countdownBlock = (item.deadline && item.status !== "closed")
    ? `<div class="ongoing-count" aria-label="締切までの残り時間">
         <i class="fa-regular fa-hourglass-half" aria-hidden="true"></i>
         <span class="time countdown" data-deadline="${escapeHtml(item.deadline)}">--日 --時間 --分 --秒</span>
       </div>`
    : "";

  return `
    <article class="ongoing-card ${theme}">
      <h3 class="ongoing-title">
        <span class="title-left">
          <i class="fas fa-paw" aria-hidden="true"></i>
          <a href="${escapeHtml(item.url || '#')}">${escapeHtml(item.title || '')}</a>
        </span>
        <span class="badge ${badgeCls}" aria-label="${badgeText}">${badgeText}</span>
      </h3>

      ${deadlineDisp ? `<div class="ongoing-meta"><span class="meta-label">応募締切：</span>${deadlineDisp}</div>` : ``}
      ${countdownBlock}
      ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ``}
      ${tags ? `<div class="ongoing-meta">${tags}</div>` : ``}
    </article>
  `.trim();
}

// ===== 読み込み・描画 =====
async function initOngoing() {
  if (!$list) return;
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("failed to load ongoing.json");
    const all = await res.json();

    // 並び順：募集中(open) → 期日が近い順 / 予告(planned) → 期日が近い順
    const open    = all.filter(x => x.status === "open");
    const planned = all.filter(x => x.status === "planned");
    // closedを一覧に混ぜたくない場合は除外

    const byDeadline = arr =>
      arr.sort((a,b) => new Date(a.deadline||"2100-12-31") - new Date(b.deadline||"2100-12-31"));

    const list = [...byDeadline(open), ...byDeadline(planned)];

    if (list.length === 0) {
      $list.innerHTML = "";
      if ($empty) $empty.style.display = "block";
    } else {
      $list.innerHTML = list.map(toCard).join("");
      if ($empty) $empty.style.display = "none";
      initCountdowns();  // ← 描画後に起動
    }
  } catch (e) {
    console.error(e);
    if ($empty) {
      $empty.textContent = "現在、募集中のイベント情報を取得できませんでした。";
      $empty.style.display = "block";
    }
  }
}

// ===== カウントダウン（毎秒更新・期限後は0固定＆バッジ“終了”） =====
function initCountdowns() {
  const nodes = document.querySelectorAll(".countdown[data-deadline]");
  if (!nodes.length) return;

  function format(diffMs) {
    const sTotal = Math.floor(diffMs / 1000);
    const d = Math.floor(sTotal / (3600 * 24));
    const h = Math.floor((sTotal % (3600 * 24)) / 3600);
    const m = Math.floor((sTotal % 3600) / 60);
    const s = sTotal % 60;
    return `${d}日 ${h}時間 ${m}分 ${s}秒`;
  }

  function update() {
    const now = Date.now();

    nodes.forEach(el => {
      if (el.dataset.done === "1") return; // 既に締切処理済

      const dl = new Date(el.dataset.deadline).getTime();
      if (isNaN(dl)) {
        el.textContent = "0日 0時間 0分 0秒";
        el.dataset.done = "1";
        return;
      }

      const diff = dl - now;
      if (diff <= 0) {
        el.textContent = "0日 0時間 0分 0秒";
        el.dataset.done = "1";

        // バッジを終了へ
        const card  = el.closest(".ongoing-card");
        const badge = card?.querySelector(".badge");
        if (badge && !badge.classList.contains("badge-closed")) {
          badge.classList.remove("badge-open","badge-planned");
          badge.classList.add("badge-closed");
          badge.textContent = "終了";
          badge.setAttribute("aria-label", "終了");
        }
        return;
      }

      el.textContent = format(diff);
    });
  }

  update();
  const timer = setInterval(update, 1000);
  window.addEventListener("pagehide", () => clearInterval(timer), { once:true });
}

document.addEventListener("DOMContentLoaded", initOngoing);
