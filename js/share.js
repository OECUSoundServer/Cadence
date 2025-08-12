/*! Share.js (Cadence) - X共有 & リンクコピー - 自動初期化 + Popup */
(function (root, factory) { root.CadenceShare = factory(); })(this, function () {
  const defaults = {
    selector: '#share-buttons',           // 置き場（複数なら .share-bar など）
    hashtags: ['Cadence', '同人サークル'],
    via: '',                               // 例: 'your_account'（@不要）
    fixedUrl: null,                        // 常に固定URLにしたい場合
    fixedTitle: null                       // 常に固定タイトルにしたい場合
  };

  const buildX = ({ title, url, hashtags, via }) => {
    const u = new URL('https://twitter.com/intent/tweet');
    u.searchParams.set('text', title);
    u.searchParams.set('url', url);
    if (hashtags && hashtags.length) u.searchParams.set('hashtags', hashtags.join(','));
    if (via) u.searchParams.set('via', via.replace(/^@/, ''));
    return u.toString();
  };

  /* ===== Popup: CSS & 関数 ===== */
  function ensureCopyPopupStyles() {
    if (document.getElementById('copy-popup-style')) return;
    const style = document.createElement('style');
    style.id = 'copy-popup-style';
    style.textContent = `
      .copy-popup-backdrop{
        position:fixed; inset:0; background:rgba(0,0,0,.35);
        display:flex; align-items:center; justify-content:center;
        z-index: 9999; opacity:0; pointer-events:none;
        transition: opacity .18s ease;
      }
      .copy-popup-backdrop.show{ opacity:1; pointer-events:auto; }
      .copy-popup{
        background:#111; color:#fff; border-radius:12px; padding:16px 18px;
        min-width: 220px; max-width: 86vw; box-shadow: 0 12px 40px rgba(0,0,0,.35);
        transform: scale(.96); opacity:0; transition: transform .18s ease, opacity .18s ease;
      }
      .copy-popup.show{ transform: scale(1); opacity:1; }
      .copy-popup .row{ display:flex; gap:10px; align-items:center; }
      .copy-popup .row i{ font-size:18px; }
      .copy-popup .msg{ font-size:14px; line-height:1.5; }
      .copy-popup .close{
        margin-top:12px; display:inline-flex; align-items:center; gap:8px;
        background:#fff; color:#111; border:0; border-radius:999px; padding:8px 14px; cursor:pointer;
        font-weight:600;
      }
      @media (prefers-reduced-motion: reduce){
        .copy-popup-backdrop, .copy-popup{ transition:none; }
      }
    `;
    document.head.appendChild(style);
  }

  function showCopyPopup(message = 'リンクをコピーしました') {
    ensureCopyPopupStyles();

    let backdrop = document.querySelector('.copy-popup-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'copy-popup-backdrop';
      backdrop.innerHTML = `
        <div class="copy-popup" role="alertdialog" aria-live="assertive" aria-modal="true">
          <div class="row">
            <i class="fa-solid fa-check"></i>
            <div class="msg"></div>
          </div>
          <button class="close" type="button"><i class="fa-solid fa-xmark"></i><span> 閉じる</span></button>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    const popup = backdrop.querySelector('.copy-popup');
    popup.querySelector('.msg').textContent = message;

    // 表示
    requestAnimationFrame(() => {
      backdrop.classList.add('show');
      popup.classList.add('show');
    });

    // 閉じる処理
    const closeBtn = popup.querySelector('.close');
    const close = () => {
      popup.classList.remove('show');
      backdrop.classList.remove('show');
    };
    const onBackdrop = (e) => { if (e.target === backdrop) close(); };
    const onEsc = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); } };

    backdrop.addEventListener('click', onBackdrop, { once: true });
    closeBtn.addEventListener('click', close, { once: true });
    document.addEventListener('keydown', onEsc, { once: true });

    // 自動で閉じる（1.8s）
    setTimeout(close, 1800);
  }
  /* ===== /Popup ===== */

  function init(options = {}) {
    const cfg = Object.assign({}, defaults, options);
    const bars = document.querySelectorAll(cfg.selector);
    if (!bars.length) return;

    bars.forEach((bar) => {
      // data-* で個別上書き
      const url =
        bar.dataset.shareUrl ||
        cfg.fixedUrl ||
        location.href.split('#')[0];

      const title =
        bar.dataset.shareTitle ||
        cfg.fixedTitle ||
        document.title || 'Cadence';

      const hashtags =
        (bar.dataset.hashtags
          ? bar.dataset.hashtags.split(',').map(s => s.trim()).filter(Boolean)
          : cfg.hashtags);

      const via = bar.dataset.via || cfg.via;

      // 要素が無ければ生成、あれば再利用
      let aX = bar.querySelector('.share-x');
      let btn = bar.querySelector('.share-copy');
      let status = bar.querySelector('.share-status');

      if (!aX) {
        aX = document.createElement('a');
        aX.className = 'share-x';
        aX.target = '_blank';
        aX.rel = 'noopener';
        bar.appendChild(aX);
      }
      aX.innerHTML = `<i class="fa-brands fa-x-twitter"></i><span>Xで共有</span>`;
      aX.href = buildX({ title, url, hashtags, via });
      aX.setAttribute('aria-label', 'Xで共有');

      if (!btn) {
        btn = document.createElement('button');
        btn.className = 'share-copy';
        btn.type = 'button';
        bar.appendChild(btn);
      }
      btn.innerHTML = `<i class="fa-solid fa-link"></i><span>リンクをコピー</span>`;
      btn.setAttribute('aria-label', 'リンクをコピー');

      if (!status) {
        status = document.createElement('span');
        status.className = 'share-status';
        status.setAttribute('aria-live', 'polite');
        bar.appendChild(status);
      } else {
        status.textContent = '';
      }

      // 重複リスナー防止
      if (!btn.dataset.bound) {
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(url);
            showCopyPopup('リンクをコピーしました');
          } catch {
            const ta = document.createElement('textarea');
            ta.value = url; document.body.appendChild(ta);
            ta.select(); document.execCommand('copy'); ta.remove();
            showCopyPopup('リンクをコピーしました');
          }
        });
        btn.dataset.bound = '1';
      }
    });
  }

  // フッターのボタン見た目（最小）
  (function injectStyle() {
    if (document.getElementById('share-style')) return;
    const css = `
      .share-bar{margin-top:.75rem;display:flex;justify-content:center;align-items:center;gap:.6rem;flex-wrap:wrap}
      .share-bar a,.share-bar button{
        display:inline-flex;align-items:center;gap:.45rem;
        padding:.5rem .9rem;border:1px solid rgba(255,255,255,.28);border-radius:.6rem;
        background:#fff;color:#111;text-decoration:none;cursor:pointer;font-size:14px;font-weight:500;
        transition:transform .08s ease, background .15s ease, box-shadow .15s ease
      }
      .share-bar a:hover,.share-bar button:hover{background:#f5f5f5;transform:translateY(-1px)}
      .share-bar i{font-size:1.1em;line-height:1;display:block}
      .share-bar .share-status{font-size:12px;color:#9be1a1;margin-left:.25rem}
    `;
    const style = document.createElement('style');
    style.id = 'share-style';
    style.textContent = css;
    document.head.appendChild(style);
  })();

  // 自動初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }

  return { init }; // 追加の置き場にも使えるよう公開
});
