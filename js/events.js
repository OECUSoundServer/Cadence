
/**
 * @file events.js
 * @brief Cadence イベント一覧の自動生成
 * @detail
 * events.json を読み込み、開催予定と過去イベントを
 * 自動分類して表示する。
 *
 * リンク先はJSONのurlで制御する。
 * - url未指定 : e.html?e=イベントID
 * - url指定   : 指定されたURL
 * - url:null  : リンクなし
 */

const EVENTS_JSON_URL = "../data/events.json";

document.addEventListener("DOMContentLoaded", initEvents);

/**
 * @fn escapeEventHtml
 * @brief HTML特殊文字のエスケープ
 * @param {*} value 変換対象
 * @return {string} エスケープ済み文字列
 */
function escapeEventHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

/**
 * @fn makeEventDate
 * @brief 日付をローカル時刻で生成
 * @param {number} year 年
 * @param {number} month 月
 * @param {number} day 日
 * @return {Date|null} 日付
 */
function makeEventDate(year, month, day) {
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * @fn parseEventDates
 * @brief イベント開催期間を取得
 * @param {Object} event イベント情報
 * @return {{start: Date, end: Date}|null} 開催期間
 * @detail
 * 通常日付と複数日開催に対応する。
 *
 * startDate / endDate があれば優先する。
 *
 * 対応例:
 * 2026/11/08
 * 2026-11-08
 * 2023/12/02 ~ 12/03
 * 2023/11/05~11/06
 */
function parseEventDates(event) {
  const raw = String(event.date || "");

  const startText = event.startDate ||
    raw.match(/\d{4}[/-]\d{1,2}[/-]\d{1,2}/)?.[0];

  if (!startText) return null;

  const startMatch = String(startText).match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
  );

  if (!startMatch) return null;

  const year = Number(startMatch[1]);
  const month = Number(startMatch[2]);
  const day = Number(startMatch[3]);

  const start = makeEventDate(year, month, day);

  if (!start) return null;

  let end = start;

  if (event.endDate) {
    const match = String(event.endDate).match(
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
    );

    if (!match) return null;

    end = makeEventDate(
      Number(match[1]),
      Number(match[2]),
      Number(match[3])
    );
  } else {
    // 複数日開催の終了日を取得
    const range = raw.match(
      /[~〜～]\s*(?:(\d{4})[/-])?(\d{1,2})[/-](\d{1,2})/
    );

    if (range) {
      end = makeEventDate(
        Number(range[1] || year),
        Number(range[2]),
        Number(range[3])
      );
    }
  }

  if (!end || end < start) return null;

  return { start, end };
}

/**
 * @fn getEventUrl
 * @brief イベントのリンク先を取得
 * @param {string} id イベントID
 * @param {Object} event イベント情報
 * @return {string|null} リンク先
 * @detail
 * urlが未指定の場合は共通お品書きページを使用する。
 * urlがnullの場合はリンクを生成しない。
 */
function getEventUrl(id, event) {
  if (Object.prototype.hasOwnProperty.call(event, "url")) {
    if (event.url === null) return null;

    if (typeof event.url !== "string") {
      console.warn("イベントURLが不正です:", id);
      return null;
    }

    const url = event.url.trim();

    if (!url) return null;

    // javascript: などの危険なURLを除外
    if (
      /^(https?:\/\/|\.{1,2}\/|\/(?!\/)|[a-zA-Z0-9_-][a-zA-Z0-9_./?=&%#-]*)$/i
        .test(url)
    ) {
      return url;
    }

    console.warn("使用できないイベントURL:", id, url);
    return null;
  }

  return `e.html?e=${encodeURIComponent(id)}`;
}

/**
 * @fn normalizeEvents
 * @brief JSONのイベント情報を正規化
 * @param {Object} data イベントJSON
 * @return {Array<Object>} イベント一覧
 */
function normalizeEvents(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("events.json の形式が不正です。");
  }

  return Object.entries(data).flatMap(([id, event]) => {
    if (!event || typeof event !== "object" || Array.isArray(event)) {
      console.warn("イベント情報が不正です:", id);
      return [];
    }

    // Cadence以外のイベントは除外
    // circle未指定の既存イベントはCadenceとして扱う
    if ((event.circle || "cadence") !== "cadence") {
        return [];
    }

    const dates = parseEventDates(event);

    if (!dates) {
      console.warn("イベント日付が不正です:", id, event.date);
      return [];
    }

    return [{
      id,
      title: event.eventName || id,
      dateText: event.date || event.startDate || "",
      place: event.place || "",
      booth: event.booth || "",
      url: getEventUrl(id, event),
      start: dates.start,
      end: dates.end,
      year: dates.start.getFullYear()
    }];
  });
}

/**
 * @fn createEventItem
 * @brief イベント一覧の1行を生成
 * @param {Object} event イベント情報
 * @return {string} HTML文字列
 * @detail
 * URLが存在する場合はリンクを生成する。
 * URLがnullの場合はイベント名のみ表示する。
 */
function createEventItem(event) {
  const title = escapeEventHtml(event.title);

  const eventLink = event.url
    ? `<a href="${escapeEventHtml(event.url)}">${title}</a>`
    : `<span class="event-name">${title}</span>`;

  const dateText = escapeEventHtml(event.dateText);

  const dateAttribute = [
    event.start.getFullYear(),
    String(event.start.getMonth() + 1).padStart(2, "0"),
    String(event.start.getDate()).padStart(2, "0")
  ].join("-");

  return `
    <li class="paw-item">
      <span class="paw-bullet">
        <i class="fas fa-paw" aria-hidden="true"></i>
      </span>

      ${eventLink}

      <time
        class="paw-date"
        datetime="${dateAttribute}"
      >
        （${dateText}）
      </time>
    </li>
  `;
}

/**
 * @fn renderUpcomingEvents
 * @brief 開催予定イベントを表示
 * @param {Array<Object>} events 開催予定イベント
 */
function renderUpcomingEvents(events) {
  const root = document.getElementById("upcoming-events");
  const section = document.getElementById("upcoming-section");

  if (!root || !section) return;

  if (events.length === 0) {
    root.replaceChildren();
    section.hidden = true;
    return;
  }

  root.innerHTML = `
    <ul class="paw-list">
      ${events.map(createEventItem).join("")}
    </ul>
  `;

  section.hidden = false;
}

/**
 * @fn renderPastEvents
 * @brief 過去イベントを年度別に表示
 * @param {Array<Object>} events 過去イベント
 */
function renderPastEvents(events) {
  const root = document.getElementById("past-events");

  if (!root) return;

  const groups = new Map();

  // 開催年ごとに分類
  events.forEach(event => {
    if (!groups.has(event.year)) {
      groups.set(event.year, []);
    }

    groups.get(event.year).push(event);
  });

  if (events.length === 0) {
    root.innerHTML = "<p>過去イベントはありません。</p>";
    return;
  }

  const currentYear = new Date().getFullYear();

  // 年度の新しい順に表示
  root.innerHTML = [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => `
      <details
        class="events-group"
        data-year="${year}"
        ${year === currentYear ? "open" : ""}
      >
        <summary class="events-year">
          ${year}年（${items.length}件）
        </summary>

        <ul class="paw-list">
          ${items.map(createEventItem).join("")}
        </ul>
      </details>
    `)
    .join("");

  initEventAccordion();
}

/**
 * @fn initEventAccordion
 * @brief 年度別アコーディオン操作
 * @detail
 * 全て展開・全て閉じるボタンを設定する。
 * 現在年が存在すれば優先して開く。
 * 存在しなければ最新年を開く。
 */
function initEventAccordion() {
  const expandBtn = document.querySelector("[data-expand-all]");
  const collapseBtn = document.querySelector("[data-collapse-all]");
  const root = document.getElementById("past-events");

  if (!root) return;

  // イベント登録は初期化時に1回だけ行う
  expandBtn?.addEventListener("click", () => {
    root.querySelectorAll(".events-group").forEach(group => {
      group.open = true;
    });
  });

  collapseBtn?.addEventListener("click", () => {
    root.querySelectorAll(".events-group").forEach(group => {
      group.open = false;
    });
  });

  const groups = root.querySelectorAll(".events-group");

  if (![...groups].some(group => group.open) && groups.length > 0) {
    groups[0].open = true;
  }
}

/**
 * @fn initEvents
 * @brief イベント一覧の初期化
 * @return {Promise<void>}
 * @detail
 * events.json を取得し、開催期間に応じて
 * 開催予定・過去イベントへ自動分類する。
 */
async function initEvents() {
  const pastRoot = document.getElementById("past-events");
  const upcomingRoot = document.getElementById("upcoming-events");
  const upcomingSection = document.getElementById("upcoming-section");

  try {
    // JSON取得
    const response = await fetch(EVENTS_JSON_URL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // JSONをイベント配列に変換
    const events = normalizeEvents(data);

    // 今日の0時を基準に判定
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    // 開催予定・開催中・過去のイベントをすべて表示
    const allEvents = events.sort((a, b) => b.start - a.start);

    // 既存の年別アコーディオンにまとめて表示
    renderPastEvents(allEvents);


  } catch (error) {
    console.error("イベント情報の取得に失敗:", error);

    if (pastRoot) {
      pastRoot.textContent =
        "イベント情報を読み込めませんでした。";
    }

    if (upcomingRoot) {
      upcomingRoot.textContent =
        "開催予定イベントを読み込めませんでした。";
    }

    if (upcomingSection) {
      upcomingSection.hidden = false;
    }
  }
}
