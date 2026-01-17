(async function () {
  // ?e=skk12 の取得
  const params = new URLSearchParams(location.search);
  let eventId = params.get("e");
  if (!eventId) return;

  // 念のため: ?e=skk12.html みたいなのも吸収
  eventId = eventId.replace(/\.html$/i, "").trim();

  async function fetchJson(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  }

  function setInfoTable(event) {
    const table = document.getElementById("infoTable");
    if (!table) return;

    const tds = table.querySelectorAll("td");
    const values = [event.eventName, event.date, event.place, event.booth, event.note];

    values.forEach((v, i) => {
      if (tds[i]) tds[i].textContent = v ?? "";
    });
  }

  // 表示用カテゴリ名（必要なら増やしてOK）
  function categoryLabel(c) {
    const map = {
      cd: "CD",
      card: "ポストカード",
      sticker: "ステッカー",
      keyring: "キーホルダー",
      booth: "BOOTH",
      bandcamp: "Bandcamp",
      free: "無料",
      other: "Other",
    };
    return map[c] ?? c.toUpperCase();
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // リンクボタンの見た目プリセット（あなたの既存HTMLに寄せる）
  function linkPreset(labelRaw) {
    const label = String(labelRaw || "").toLowerCase();

    // class だけ変える（色は既存CSSに依存）
    // 既存で使ってた: button-red, button-green2
    if (label === "booth") {
      return { className: "button-red", text: "booth", style: "color:#fff;" };
    }
    if (label === "unity" || label === "unityroom") {
      return { className: "button-green2", text: "Unity", style: "color:#fff;" };
    }
    if (label === "bandcamp") {
      // ※ button-blue が無ければ button-red 等に置き換えてOK
      return { className: "button-blue", text: "Bandcamp", style: "color:#fff;" };
    }

    // 不明なラベルは無難にグレー
    return { className: "button-dark", text: labelRaw, style: "color:#fff;" };
  }

  // links: [{label,url}] から <a class="button ..."> を作る
  function buildLinkButtons(item) {
    const links = Array.isArray(item.links) ? item.links : [];
    if (!links.length) return "";

    return links
      .filter((x) => x && x.url)
      .map((x) => {
        const preset = linkPreset(x.label);
        const text = escapeHtml(preset.text ?? x.label ?? "link");
        const url = escapeHtml(x.url);

        // ※ target="_blank" は好み。既存に合わせたいなら外してOK。
        return `
          <a href="${url}"
             class="button button-3d button-mini button-rounded ${preset.className}"
             style="${preset.style}">
             ${text}
          </a>
        `;
      })
      .join("");
  }

  // ★eventText を受け取らず、releaseText を item から出す
  function buildItem(item, eventDateISO) {
    const cats = new Set(item.categories || []);
    if (item.isNew) cats.add("new");

    // ★現価格
    const hasPrice =
      item.price !== undefined &&
      item.price !== null &&
      !Number.isNaN(Number(item.price));
    const priceNow = hasPrice ? Number(item.price) : null;

    // ★旧価格
    const hasOldPrice =
      item.priceOld !== undefined &&
      item.priceOld !== null &&
      !Number.isNaN(Number(item.priceOld));
    const priceOld = hasOldPrice ? Number(item.priceOld) : null;

    // ★旧価格は「現価格と違う時だけ」表示（同額なら出さない）
    const showOldPrice = priceOld !== null && priceNow !== null && priceOld !== priceNow;

    const li = document.createElement("li");
    li.className = "target";
    li.dataset.category = Array.from(cats).join(" ");

    const releaseText = item.releaseText ?? "";

    // ★特典など：正方形画像にしたい場合
    const imageHtml = item.squareImage
      ? `
        <div class="square-image">
          <a href="${escapeHtml(item.detail)}">
            <img src="${escapeHtml(item.thumb)}" alt="">
          </a>
        </div>
      `
      : `
        <a href="${escapeHtml(item.detail)}">
          <img src="${escapeHtml(item.thumb)}" alt="">
        </a>
      `;

    // ★リンクボタン（booth / Unity / etc）
    const buttonsHtml = buildLinkButtons(item);

    li.innerHTML = `
      <figure>
        <div class="portfolio-overlay">
          ${imageHtml}
          <div class="hover-mask">
            <p>
              <div class="circle">
                <h2><a href="${escapeHtml(item.thumb)}"><i class="fa fa-plus"></i></a></h2>
              </div>
              <div class="circle">
                <h2><a href="${escapeHtml(item.detail)}"><i class="fa fa-bars"></i></a></h2>
              </div>
            </p>
          </div>
        </div>

        ${buttonsHtml}

        <h2 class="target-title">
          <a href="${escapeHtml(item.detail)}">${escapeHtml(item.name)}</a>
        </h2>

        <ol class="target-categories">
          ${item.isNew ? `<li><strong class="label label-danger">New</strong></li>` : ""}
          ${Array.from(cats)
            .filter((c) => c !== "new")
            .map((c) => `<li><strong class="label label-danger">${escapeHtml(categoryLabel(c))}</strong></li>`)
            .join("")}
          <time datetime="${escapeHtml(eventDateISO)}"></time>
        </ol>

        <figcaption style="font-size:1.5rem;">${priceNow ?? ""}円</figcaption>
        ${showOldPrice ? `<figcaption><s>${priceOld}円</s></figcaption>` : ""}
        ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
        ${releaseText ? `<figcaption>${escapeHtml(releaseText)}</figcaption>` : ""}
      </figure>
    `;
    return li;
  }

  try {
    const [events, items, lineups] = await Promise.all([
      fetchJson("../data/events.json"),
      fetchJson("../data/items.json"),
      fetchJson("../data/lineups.json"),
    ]);

    const event = events[eventId];
    if (!event) {
      console.error(`events.json に "${eventId}" がありません`, Object.keys(events));
      return;
    }

    const lineup = lineups[eventId];
    if (!lineup) {
      console.error(`lineups.json に "${eventId}" がありません`, Object.keys(lineups));
      return;
    }

    // イベント情報反映（ページ上部の表）
    setInfoTable(event);

    // ページタイトル
    if (event.pageTitle) document.title = event.pageTitle;

    // time datetime 用（表示の固定テキストとは別物）
    const eventDateISO = (event.date || "").replace(/\//g, "-");

    const targetList = document.querySelector("ol.targets");
    if (!targetList) return;

    // 一覧をデータから生成し直す
    targetList.innerHTML = "";

    lineup.items.forEach((row) => {
      const master = items[row.id];
      if (!master) return;

      // 合成（イベント側 row が上書き）
      const merged = {
        ...master,
        ...row,

        // 表示系
        caption: row.caption ?? master.captionDefault,
        releaseText: row.releaseText ?? master.releaseText,

        // 画像形状
        squareImage: row.squareImage ?? master.squareImage,

        // 旧価格（row で上書き可能）
        priceOld: row.priceOld ?? master.priceOld,

        // リンク（row で上書き可能）
        links: row.links ?? master.links,
      };

      targetList.appendChild(buildItem(merged, eventDateISO));
    });
  } catch (err) {
    console.error("Event injector error:", err);
  }
})();
