// /js/events.js
document.addEventListener('DOMContentLoaded', () => {
  const expandBtn = document.querySelector('[data-expand-all]');
  const collapseBtn = document.querySelector('[data-collapse-all]');
  const groups = document.querySelectorAll('.events-group');

  // 全て展開 / 全て閉じる
  expandBtn?.addEventListener('click', () => groups.forEach(d => d.open = true));
  collapseBtn?.addEventListener('click', () => groups.forEach(d => d.open = false));

  // 現在年のグループだけ自動で open（既に open 指定がある場合はそれを優先）
  const currentYear = String(new Date().getFullYear());
  const alreadyOpen = Array.from(groups).some(d => d.open);
  if (!alreadyOpen) {
    const current = document.querySelector(`.events-group[data-year="${currentYear}"]`);
    if (current) current.open = true;
  }
});
