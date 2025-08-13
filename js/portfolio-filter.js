/*! portfolio-filter.js - radio(カテゴリ)と URL ?category= の双方向同期 */
(function () {
  const PARAM = 'category';
  const NAME  = 'categories';

  // ラジオ群を取得
  const radios = Array.from(document.querySelectorAll(`input[type="radio"][name="${NAME}"]`));
  if (!radios.length) return;

  // value → input のマップ（大文字/小文字ゆるく対応）
  const map = new Map(radios.map(r => [r.value.toLowerCase(), r]));

  // URL から category を取得（なければ "All"）
  function getURLCat() {
    const p = new URLSearchParams(location.search);
    const v = (p.get(PARAM) || '').trim();
    return v || 'All';
  }

  // 指定カテゴリを URL に反映（All のときはパラメータ削除）
  function setURLCat(cat, push = true) {
    const url = new URL(location.href);
    if (cat && cat.toLowerCase() !== 'all') url.searchParams.set(PARAM, cat);
    else url.searchParams.delete(PARAM);
    (push ? history.pushState : history.replaceState).call(history, {[PARAM]: cat}, '', url.toString());
  }

  // ラジオをチェックして、既存のCSS/JSが反応するよう change を飛ばす
  function checkRadio(cat) {
    const key = (cat || '').toLowerCase();
    const target = map.get(key) || map.get('all');
    if (!target) return;

    // 既に選ばれているなら何もしない
    if (!target.checked) {
      target.checked = true;
      // 既存スクリプトが change を拾う前提に合わせる
      target.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // 初期：URL優先でラジオに反映し、URLも正規化（小文字/All の時は削除）
  const initCat = getURLCat();
  checkRadio(initCat);
  setURLCat(initCat, /*push=*/false);

  // ラジオ操作 → URL を更新
  radios.forEach(r => {
    r.addEventListener('change', () => {
      if (!r.checked) return;
      const cat = r.value;
      setURLCat(cat, /*push=*/true);
      // ここでフィルタ自体は既存CSS(:checked)や既存JSが反映してくれる想定
    });
  });

  // 戻る/進む対応：URL -> ラジオへ
  window.addEventListener('popstate', () => {
    checkRadio(getURLCat());
  });
})();
