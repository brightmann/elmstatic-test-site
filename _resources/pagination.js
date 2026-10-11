/* Keep every post readable without JavaScript; enhance lists with URL-based pages. */
(() => {
  function paginate() {
    const list = document.querySelector('[data-post-list]');
    if (!list) return;
    const posts = Array.from(list.children);
    const size = Number(list.dataset.pageSize) || 5;
    const total = Math.max(1, Math.ceil(posts.length / size));
    const url = new URL(window.location.href);
    const raw = url.searchParams.get('page');
    const requested = raw && /^[1-9]\d*$/.test(raw) ? Number(raw) : 1;
    const page = Math.min(total, requested);
    if (raw !== null && raw !== String(page)) {
      if (page === 1) url.searchParams.delete('page');
      else url.searchParams.set('page', String(page));
      window.history.replaceState(null, '', url);
    }
    posts.forEach((post, index) => {
      post.hidden = index < (page - 1) * size || index >= page * size;
    });
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Post pagination');
    nav.style.cssText = 'display:flex;align-items:center;flex-wrap:wrap;gap:1rem;margin:2rem 0;';
    const link = (number, label, relation) => {
      const target = new URL(window.location.href);
      if (number === 1) target.searchParams.delete('page');
      else target.searchParams.set('page', String(number));
      target.hash = '';
      const anchor = document.createElement('a');
      anchor.href = target.pathname + target.search;
      anchor.textContent = label;
      anchor.rel = relation;
      return anchor;
    };
    if (page > 1) nav.append(link(page - 1, 'Previous', 'prev'));
    const status = document.createElement('span');
    status.textContent = `Page ${page} of ${total}`;
    status.setAttribute('aria-current', 'page');
    nav.append(status);
    if (page < total) nav.append(link(page + 1, 'Next', 'next'));
    list.after(nav);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paginate, { once: true });
  } else paginate();
})();
