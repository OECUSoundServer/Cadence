const DATA_URL = "../data/ongoing.json";
const $ongoingList = document.getElementById("ongoing-events");
const $ongoingEmpty = document.querySelector("#ongoing-section .no-events");
const $archRoot = document.getElementById("archive-accordion");
const $archEmpty = document.querySelector("#archive-section .no-archive");

// もし「応募フォームを開く」リンクもカードに出したい場合は設定して使ってください（任意）
const FORM_BASE =
  "https://docs.google.com/forms/d/e/1FAIpQLSeoYshfFZFMPb_OTgIIxS0y-SP34_p9gMLWYGy4PdOcPCrkVg/viewform";
const FORM_ENTRY = "entry.616039945";

function escapeHtml(s = "") {
  return String(s).replace(/[&<>"']/g, (c) => {
    return (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ] || c
    );
  });
}

function toCard(item, { withCountdown = true } = {}) {
  // status → バッジ & デフォテーマ
  let badgeCls = "badge-open",
    badgeText = "募集中";
  if (item.status === "planned") {
    badgeCls = "badge-planned";
    badgeText = "予告";
  }
  if (item.status === "closed") {
    badgeCls = "badge-closed";
    badgeText = "終了";
  }

  const theme = item.theme
    ? `theme-${item.theme}`
    : item.status === "closed"
    ? "theme-gray"
    : "theme-green";

  // 締切の日付表示
  let deadlineDisp = "";
  if (item.deadline) {
    const d = new Date(item.deadline);
    if (!isNaN(d)) {
      deadlineDisp = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(d.getDate()).padStart(2, "0")}`;
    }
  }

  const tags = (item.tags || []).map((t) => `#${escapeHtml(t)}`).join(" ");

  const needCountdown =
    withCountdown && item.deadline && item.status !== "closed";
  const countdownBlock = needCountdown
    ? `<div class="ongoing-count">
         <i class="fa-regular fa-hourglass-half" aria-hidden="true"></i>
         <span class="countdown" data-deadline="${escapeHtml(
           item.deadline
         )}">--</span>
       </div>`
    : "";

  // ---- 追加：イベントコード（コピー用） ----
  // JSONに eventCode があるときだけ表示
  const hasCode = !!item.eventCode;
  const eventCodeDisplay = item.eventCode
  ? `<div class="ongoing-meta event-code">
       <span class="meta-label">イベントコード：</span>
       <code>${escapeHtml(item.eventCode)}</code>
     </div>`
  : "";

  // ---- 任意：id表示（デバッグ/管理用途） ----
  // 表示したくないなら false にしてください
  const SHOW_ID = false;
  const idBlock =
    SHOW_ID && item.id
      ? `<div class="ongoing-meta"><span class="meta-label">ID：</span>${escapeHtml(
          item.id
        )}</div>`
      : "";

  // ---- 任意：応募フォームリンク（open/plannedのみ） ----
  // eventCodeがあり、終了でない場合のみ表示
  const applyLink =
    item.status !== "closed" && item.eventCode
      ? `<div class="ongoing-meta">
           <a class="btn apply-btn" target="_blank"
              href="${FORM_BASE}?${FORM_ENTRY}=${encodeURIComponent(
          item.eventCode
        )}">
              応募フォームを開く
           </a>
         </div>`
      : "";

  return `
  <article
    class="ongoing-card ${theme}"
    data-id="${escapeHtml(item.id || "")}"
    data-event-code="${escapeHtml(item.eventCode || "")}"
  >
    <h3 class="ongoing-title">
      <span class="title-left">
        <i class="fas fa-paw" aria-hidden="true"></i>
        <a href="${escapeHtml(item.url || "#")}">${escapeHtml(
  item.title || ""
)}</a>
      </span>
      <span class="badge ${badgeCls}" aria-label="${badgeText}">
        ${badgeText}
      </span>
    </h3>

    ${
      deadlineDisp
        ? `<div class="ongoing-meta">
             <span class="meta-label">応募締切：</span>${deadlineDisp}
           </div>`
        : ""
    }

    ${countdownBlock}
    ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}

    ${eventCodeDisplay}

    ${tags ? `<div class="ongoing-meta">${tags}</div>` : ""}
  </article>
`.trim();

}

function initCountdowns() {
  const nodes = document.querySelectorAll(".countdown[data-deadline]");
  if (!nodes.length) return;

  function update() {
    const now = Date.now();
    nodes.forEach((el) => {
      const t = new Date(el.dataset.deadline).getTime();
      if (isNaN(t)) {
        el.textContent = "--";
        return;
      }

      let diff = t - now;
      if (diff < 0) diff = 0;

      const sec = Math.floor(diff / 1000);
      const d = Math.floor(sec / 86400);
      const h = Math.floor((sec % 86400) / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;

      el.textContent = `残り：${d}日 ${h}時間 ${m}分 ${s}秒`;

      if (diff === 0) {
        const card = el.closest(".ongoing-card");
        const badge = card?.querySelector(".badge");
        if (badge) {
          badge.classList.remove("badge-open", "badge-planned");
          badge.classList.add("badge-closed");
          badge.textContent = "終了";
        }
      }
    });
  }

  update();
  const timer = setInterval(update, 1000);
  window.addEventListener(
    "pagehide",
    () => {
      clearInterval(timer);
    },
    { once: true }
  );
}

function groupClosedByYear(items) {
  const map = new Map();
  items.forEach((it) => {
    const d = it.deadline ? new Date(it.deadline) : null;
    const y = d && !isNaN(d) ? d.getFullYear() : "年不明";
    if (!map.has(y)) map.set(y, []);
    map.get(y).push(it);
  });

  // 年降順
  return Array.from(map.entries()).sort((a, b) =>
    b[0] === "年不明" ? -1 : a[0] === "年不明" ? 1 : b[0] - a[0]
  );
}

async function initRecruitPage() {
  // 取得
  let all = [];
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("failed to load ongoing.json");
    all = await res.json();
  } catch (e) {
    console.error(e);
  }

  // === 募集中/予告 ===
  if ($ongoingList) {
    const sortBy = (arr) =>
      arr.sort(
        (a, b) =>
          new Date(a.deadline || "2100-12-31") -
          new Date(b.deadline || "2100-12-31")
      );

    const open = sortBy(all.filter((x) => x.status === "open"));
    const planned = sortBy(all.filter((x) => x.status === "planned"));
    const liveList = [...open, ...planned];

    if (liveList.length === 0) {
      $ongoingList.innerHTML = "";
      if ($ongoingEmpty) $ongoingEmpty.style.display = "block";
    } else {
      $ongoingList.innerHTML = liveList
        .map((it) => toCard(it, { withCountdown: true }))
        .join("");

      if ($ongoingEmpty) $ongoingEmpty.style.display = "none";
      initCountdowns();
    }
  }

  // === アーカイブ（終了のみ） ===
  if ($archRoot) {
    const closed = all
      .filter((x) => x.status === "closed")
      .sort((a, b) => new Date(b.deadline || 0) - new Date(a.deadline || 0));

    if (closed.length === 0) {
      if ($archEmpty) $archEmpty.style.display = "block";
      $archRoot.innerHTML = "";
      return;
    }

    if ($archEmpty) $archEmpty.style.display = "none";

    const groups = groupClosedByYear(closed);
    const html = groups
      .map(([year, items]) => {
        const cards = items
          .map((it) => toCard(it, { withCountdown: false }))
          .join("");

        return `
          <details>
            <summary>${year}年（${items.length}件）</summary>
            <div class="archive-grid">
              ${cards}
            </div>
          </details>
        `;
      })
      .join("");

    $archRoot.innerHTML = html;
  }
}

// 複数カード対応：コピー
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  const row = btn.closest(".event-code-row");
  const codeEl = row?.querySelector(".eventCode");
  if (!codeEl) return;

  const code = codeEl.textContent.trim();

  navigator.clipboard
    .writeText(code)
    .then(() => {
      btn.textContent = "コピー済み";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "コピー";
        btn.disabled = false;
      }, 1200);
    })
    .catch(() => {
      alert("コピーに失敗しました。手動でコピーしてください: " + code);
    });
});

document.addEventListener("DOMContentLoaded", initRecruitPage);
