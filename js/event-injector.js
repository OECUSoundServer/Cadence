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
      set: "セット",
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

  function linkPreset(labelRaw) {
    const label = String(labelRaw || "").toLowerCase();

    if (label === "booth") {
      return { className: "button-red", text: "booth", style: "color:#fff;" };
    }
    if (label === "unity" || label === "unityroom") {
      return { className: "button-green2", text: "Unity", style: "color:#fff;" };
    }
    if (label === "bandcamp") {
      return { className: "button-blue", text: "Bandcamp", style: "color:#fff;" };
    }

    return { className: "button-dark", text: labelRaw, style: "color:#fff;" };
  }

  function buildLinkButtons(item) {
    const links = Array.isArray(item.links) ? item.links : [];
    if (!links.length) return "";

    return links
      .filter((x) => x && x.url)
      .map((x) => {
        const preset = linkPreset(x.label);
        const text = escapeHtml(preset.text ?? x.label ?? "link");
        const url = escapeHtml(x.url);

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

  function buildSetLinks(item, allItems) {
    const ids = Array.isArray(item.setItems) ? item.setItems : [];
    if (!ids.length) return "";

    return ids
      .map((id) => {
        const ref = allItems[id];
        if (!ref) return `<span>${escapeHtml(id)}</span>`;

        const name = escapeHtml(ref.name ?? id);
        const url = escapeHtml(ref.detail ?? "#");
        return `<a href="${url}">${name}</a>`;
      })
      .join(" / ");
  }

  // セット画像を左右ボタンで切り替えるHTMLを作る
  function buildSetImageSlider(item, allItems, sliderId) {
    const ids = Array.isArray(item.setItems) ? item.setItems : [];
    if (!ids.length) return "";

    const slides = ids
      .map((id, index) => {

        const ref = allItems[id];
        if (!ref || !ref.thumb) return "";

        const thumb = escapeHtml(ref.thumb);
        const detail = escapeHtml(ref.detail ?? "#");
        const name = escapeHtml(ref.name ?? id);

        return `
          <a href="${detail}" class="set-slide ${index === 0 ? "is-active" : ""}">
            <div class="set-slide-square">
              <img src="${thumb}" alt="${name}">
            </div>
          </a>
        `;
      })
      .filter(Boolean)
      .join("");

    if (!slides) return "";

    return `
      <div class="set-slider" id="${sliderId}">
        <button type="button" class="set-slider-btn prev">‹</button>

        <div class="set-slider-viewport">
          ${slides}
        </div>

        <button type="button" class="set-slider-btn next">›</button>
      </div>
    `;
  }

  function calcSetDiscount(item, allItems) {
    const ids = Array.isArray(item.setItems) ? item.setItems : [];
    if (!ids.length) return null;

    const sum = ids.reduce((total, id) => {
      const ref = allItems[id];
      const price = Number(ref?.price ?? 0);
      return total + price;
    }, 0);

    const setPrice = Number(item.price ?? 0);

    if (!sum || !setPrice) return null;

    const discount = sum - setPrice;
    if (discount <= 0) return null;

    const rate = Math.round((discount / sum) * 100);

    return { sum, discount, rate };
  }

  function initSlider(root) {
    if (!root) return;

    const slides = Array.from(root.querySelectorAll(".set-slide"));
    if (slides.length <= 1) {
      const prevBtn = root.querySelector(".prev");
      const nextBtn = root.querySelector(".next");
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      return;
    }

    let current = slides.findIndex((el) => el.classList.contains("is-active"));
    if (current < 0) current = 0;

    function render() {
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === current);
      });
    }

    const prevBtn = root.querySelector(".prev");
    const nextBtn = root.querySelector(".next");

    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      current = (current - 1 + slides.length) % slides.length;
      render();
    });

    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      current = (current + 1) % slides.length;
      render();
    });

    render();
  }

  function buildItem(item, eventDateISO, allItems, itemIndex) {
    const cats = new Set(item.categories || []);
    if (item.isNew) cats.add("new");

    const hasPrice =
      item.price !== undefined &&
      item.price !== null &&
      !Number.isNaN(Number(item.price));
    const priceNow = hasPrice ? Number(item.price) : null;

    const hasOldPrice =
      item.priceOld !== undefined &&
      item.priceOld !== null &&
      !Number.isNaN(Number(item.priceOld));
    const priceOld = hasOldPrice ? Number(item.priceOld) : null;

    const showOldPrice = priceOld !== null && priceNow !== null && priceOld !== priceNow;

    const discountInfo = calcSetDiscount(item, allItems);
    const releaseText = item.releaseText ?? "";
    const setLinksHtml = buildSetLinks(item, allItems);
    const sliderId = `set-slider-${itemIndex}-${String(item.id ?? "item").replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const setSliderHtml = buildSetImageSlider(item, allItems, sliderId);

    const li = document.createElement("li");
    li.className = "target";
    li.dataset.category = Array.from(cats).join(" ");

    const imageHtml = setSliderHtml || (
      item.squareImage
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
        `
    );

    const buttonsHtml = buildLinkButtons(item);

    li.innerHTML = `
      <figure>
        <div class="portfolio-overlay">
          ${imageHtml}
          <div class="hover-mask">
            <p>
              <div class="circle">
                <h2><a href="${escapeHtml(item.thumb ?? "#")}"><i class="fa fa-plus"></i></a></h2>
              </div>
              <div class="circle">
                <h2><a href="${escapeHtml(item.detail ?? "#")}"><i class="fa fa-bars"></i></a></h2>
              </div>
            </p>
          </div>
        </div>

        ${buttonsHtml}

        <h2 class="target-title">
          <a href="${escapeHtml(item.detail ?? "#")}">${escapeHtml(item.name)}</a>
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
        ${item.memo ? `<figcaption style="color:#e74c3c;font-weight:bold;">${escapeHtml(item.memo)}</figcaption>` : ""}
        ${setLinksHtml ? `
          <figcaption>
            <span style="font-weight:bold;">${escapeHtml(item.setLabel ?? "セット内容")}：</span>
            ${setLinksHtml}
          </figcaption>
        ` : ""}
        ${discountInfo ? `
          <figcaption style="color:#27ae60;font-weight:bold;">
            ${discountInfo.discount}円お得（${discountInfo.rate}%OFF）
          </figcaption>
        ` : ""}
      </figure>
    `;

    const sliderRoot = li.querySelector(`#${CSS.escape(sliderId)}`);
    initSlider(sliderRoot);

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

    setInfoTable(event);

    if (event.pageTitle) document.title = event.pageTitle;

    const eventDateISO = (event.date || "").replace(/\//g, "-");

    const targetList = document.querySelector("ol.targets");
    if (!targetList) return;

    targetList.innerHTML = "";

    lineup.items.forEach((row, index) => {
      const master = items[row.id];
      if (!master) return;

      const merged = {
        ...master,
        ...row,

        caption: row.caption ?? master.captionDefault,
        releaseText: row.releaseText ?? master.releaseText,
        memo: row.memo ?? master.memo,
        setItems: row.setItems ?? master.setItems,
        setLabel: row.setLabel ?? master.setLabel,

        squareImage: row.squareImage ?? master.squareImage,
        priceOld: row.priceOld ?? master.priceOld,
        links: row.links ?? master.links,
      };

      targetList.appendChild(buildItem(merged, eventDateISO, items, index));
    });
  } catch (err) {
    console.error("Event injector error:", err);
  }
})();