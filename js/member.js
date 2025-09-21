const MEMBERS_JSON = "../data/members.json"; // 置き場所に合わせて調整

// key → Font Awesome + 表示名
const SOCIAL_MAP = {
  twitter: { icon: "fab fa-x-twitter", label: "X" },
  pixiv: { icon: "fas fa-palette", label: "pixiv" },
  youtube: { icon: "fab fa-youtube", label: "YouTube" },
  soundcloud: { icon: "fab fa-soundcloud", label: "SoundCloud" },
  booth: { icon: "fas fa-store", label: "BOOTH" },
  website: { icon: "fas fa-link", label: "Website" },
  discord: { icon: "fab fa-discord", label: "Discord" },
  instagram: { icon: "fa-brands fa-instagram", label: "Instagram"},
  threads: { icon: "fa-brands fa-threads", label: "threads"},
  twitch: { icon: "fa-brands fa-twitch", label: "Twitch"},
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function socialLinks(sns = {}) {
  const items = Object.entries(sns)
    .filter(([, url]) => !!url)
    .map(([k, url]) => {
      const m = SOCIAL_MAP[k] || { icon: "fas fa-link", label: k };
      return `<a href="${esc(url)}" target="_blank" rel="noopener">
                <i class="${m.icon}" aria-hidden="true"></i><span>${
        m.label
      }</span>
              </a>`;
    });
  return items.length
    ? `<div class="member-links">${items.join("")}</div>`
    : "";
}

function toMemberCard(m) {
  const roleClass =
    m.role_key === "lead"
      ? "role-lead"
      : m.role_key === "sub"
      ? "role-sub"
      : m.role_key === "fin"
      ? "role-fin"
      : m.role_key === "subguest"
      ? "role-subguest"
      : m.role_key === "guest"
      ? "role-guest"
      : "";

  const avatar = m.avatar
    ? `<img src="${esc(m.avatar)}" alt="${esc(m.name)}のアイコン">`
    : `<i class="fa-regular fa-user" aria-hidden="true"></i>`;

  const tags = (m.tags || [])
    .map((t) => `<span class="member-tag">#${esc(t)}</span>`)
    .join("");

  return `
  <article class="member-card ${roleClass}">
    <div class="member-top">
      <div class="member-avatar">${avatar}</div>
      <div class="member-head">
        <div class="member-headline">
          <span class="member-name">${esc(m.name)}</span>
          <span class="member-role"><i class="fa-solid fa-paw"></i>${esc(
            m.role
          )}</span>
        </div>
        ${m.kana ? `<div class="member-kana">(${esc(m.kana)})</div>` : ""}
      </div>
    </div>

    ${
      m.bio ? `<p class="member-bio">${m.bio}</p>` : ""
    }   <!-- ← escapeしない -->
    ${tags ? `<div class="member-tags">${tags}</div>` : ""}
    ${socialLinks(m.social)}
  </article>
`.trim();
}

async function initMembers() {
  const root = document.getElementById("member-grid");
  const empty = document.querySelector("#members .no-members");
  if (!root) return;

  try {
    const res = await fetch(MEMBERS_JSON, { cache: "no-store" });
    if (!res.ok) throw new Error("failed to load members.json");
    const data = await res.json();

    // 並び順：役職優先→表示順→名前
    const roleOrder = { lead: 0, sub: 1, fin: 2, member: 3, subguest: 5, guest: 4 };
    data.sort((a, b) => {
      const ra = roleOrder[a.role_key] ?? 99;
      const rb = roleOrder[b.role_key] ?? 99;
      if (ra !== rb) return ra - rb;
      const oa = a.order ?? 9999,
        ob = b.order ?? 9999;
      if (oa !== ob) return oa - ob;
      return (a.name || "").localeCompare(b.name || "");
    });

    root.innerHTML = data.map(toMemberCard).join("");
    if (empty) empty.style.display = data.length ? "none" : "block";
  } catch (e) {
    console.error(e);
    if (empty) empty.style.display = "block";
  }
}
document.addEventListener("DOMContentLoaded", initMembers);
