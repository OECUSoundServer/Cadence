/*! stickyPreview.js - generic follower player beside text (no deps) */
(function(){
  class StickyPreview {
    constructor(root, opts={}){
      this.root = root;
      this.textEl = root.querySelector('[data-role="text"]');
      this.sideEl = root.querySelector('[data-role="side"]');
      if (!this.textEl || !this.sideEl) return;

      this.embed = opts.embed ?? root.dataset.embed ?? '';
      this.stickyTop = toNum(root.dataset.stickyTop, opts.stickyTop, 144);
      this.height = toNum(root.dataset.height, opts.height, 150);
      this.ease = clamp(toNum(root.dataset.ease, opts.ease, 0.15), 0.05, 0.4);
      this.insertMode = (root.dataset.insertAnchors || opts.insertAnchors || 'auto');

      if (!this.embed) return;

      this.sideEl.style.top = this.stickyTop + 'px';

      this.box = this.sideEl.querySelector('.media-follow__box') || document.createElement('div');
      this.box.className = 'media-follow__box';
      this.box.style.height = this.height + 'px';
      if (!this.box.parentNode) this.sideEl.appendChild(this.box);

      if (!this.box.querySelector('iframe')){
        const ifm = document.createElement('iframe');
        ifm.src = this.embed;
        ifm.title = 'Embedded player';
        ifm.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        ifm.allowFullscreen = true;
        this.box.appendChild(ifm);
      }

      this.anchors = [...this.textEl.querySelectorAll('.ly-anchor')];
      if (this.anchors.length === 0 && this.insertMode === 'auto'){
        this.autoInsertAnchors();
        this.anchors = [...this.textEl.querySelectorAll('.ly-anchor')];
      }
      if (this.anchors.length === 0){
        const a = document.createElement('span');
        a.className = 'ly-anchor';
        this.textEl.prepend(a);
        this.anchors = [a];
      }

      this.currentY = 0;
      this.targetY = 0;

      this.updateTarget = this.updateTarget.bind(this);
      this.tick = this.tick.bind(this);

      window.addEventListener('scroll', this.updateTarget, { passive:true });
      window.addEventListener('resize', this.updateTarget);
      this.resizeObs = new ResizeObserver(this.updateTarget);
      this.resizeObs.observe(this.textEl);
      this.resizeObs.observe(this.sideEl);

      this.updateTarget();
      this.raf = requestAnimationFrame(this.tick);
    }

    autoInsertAnchors(){
      this.textEl.insertAdjacentHTML('afterbegin', '<span class="ly-anchor"></span>');
      const html = this.textEl.innerHTML;
      const replaced = html.replace(/(<br\s*\/?>\s*)(<br\s*\/?>)/gi, '$1$2<span class="ly-anchor"></span>');
      if (replaced !== html) this.textEl.innerHTML = replaced;
    }

    updateTarget(){
      const textRect = this.textEl.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;

      let best = null, bestDist = Infinity;
      for (const a of this.anchors){
        const r = a.getBoundingClientRect();
        const center = r.top + r.height/2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < bestDist){ best = a; bestDist = dist; }
      }
      if (!best) return;

      const anchorRelTop = best.getBoundingClientRect().top - textRect.top;
      const maxMove = Math.max(0, this.sideEl.clientHeight - this.box.clientHeight);
      this.targetY = clamp(anchorRelTop, 0, maxMove);
    }

    tick(){
      this.currentY += (this.targetY - this.currentY) * this.ease;
      if (Math.abs(this.targetY - this.currentY) < 0.4) this.currentY = this.targetY;
      this.box.style.transform = `translateY(${this.currentY}px)`;
      this.raf = requestAnimationFrame(this.tick);
    }

    destroy(){
      cancelAnimationFrame(this.raf);
      window.removeEventListener('scroll', this.updateTarget);
      window.removeEventListener('resize', this.updateTarget);
      if (this.resizeObs) this.resizeObs.disconnect();
    }
  }

  function toNum(...vals){
    for (const v of vals){
      if (v == null) continue;
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
    return undefined;
  }
  function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }

  function initAll(){
    const roots = document.querySelectorAll('.media-follow');
    const instances = [];
    roots.forEach(root => {
      const inst = new StickyPreview(root, {});
      if (inst && inst.embed) instances.push(inst);
    });
    window.__StickyPreview__ = instances;
    return instances;
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
