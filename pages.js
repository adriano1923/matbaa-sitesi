/* NovaDent alt sayfa etkileşim katmanı — index.html dışındaki sayfalar için, framework'siz */
/* script.js ana sayfaya özel bileşenlere (karşılaştırma sliderı, yorum karuseli, randevu formu)
   bağlıdır. Bu dosya yalnızca tüm sayfalarda ortak olan davranışları içerir ve
   eksik eleman durumunda sessizce devre dışı kalır. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;

  /* Mobil menü */
  const menu = $('.menu-toggle'), nav = $('#mainNav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    });
    $$('#mainNav a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  /* Tema tercihi ana sayfayla aynı anahtarı paylaşır */
  const savedTheme = localStorage.getItem('nova-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  const themeToggle = $('.theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('nova-theme', root.dataset.theme);
    themeToggle.setAttribute('aria-label', dark ? 'Açık temayı aç' : 'Koyu temayı aç');
  });

  const langToggle = $('.lang-toggle');
  if (langToggle) langToggle.addEventListener('click', e => {
    const en = e.currentTarget.textContent.trim() === 'TR / EN';
    e.currentTarget.textContent = en ? 'EN / TR' : 'TR / EN';
    e.currentTarget.setAttribute('aria-label', en ? 'Dili Türkçe yap' : 'Dili İngilizce yap');
  });

  /* Görünüme girince açılma */
  const revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* Başa dön */
  const toTop = $('.to-top');
  if (toTop) {
    addEventListener('scroll', () => toTop.classList.toggle('visible', scrollY > 600), { passive: true });
    toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* Hizmet filtresi */
  const filterButtons = $$('.filter-bar button');
  if (filterButtons.length) filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(b => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    $$('.service-card').forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
  }));

  /* Hizmet detay penceresi */
  const modal = $('#serviceModal');
  if (modal) {
    let lastFocus;
    const closeModal = () => { modal.hidden = true; document.body.classList.remove('modal-open'); lastFocus?.focus(); };
    const openModal = title => {
      lastFocus = document.activeElement;
      $('#modalTitle').textContent = title;
      modal.hidden = false;
      document.body.classList.add('modal-open');
      $('.modal-close', modal).focus();
    };
    $$('[data-modal]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.modal)));
    $('.modal-close', modal)?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    $('a', modal)?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  }

  /* Sayaçlar */
  const statsBand = $('.stats-band');
  if (statsBand) {
    let counted = false;
    const statObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || counted) return;
      counted = true;
      $$('[data-count]').forEach(el => {
        const target = Number(el.dataset.count), start = performance.now(), duration = 1300;
        const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
        const decimals = String(target).includes('.') ? 1 : 0;
        const tick = now => {
          const p = Math.min((now - start) / duration, 1), value = target * (1 - Math.pow(1 - p, 3));
          el.textContent = prefix + value.toLocaleString('tr-TR', { minimumFractionDigits: p === 1 ? decimals : 0, maximumFractionDigits: decimals }) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: .3 });
    statObserver.observe(statsBand);
  }

  /* Çerez tercihi */
  const cookie = $('.cookie-bar');
  if (cookie) {
    if (localStorage.getItem('nova-cookie')) cookie.classList.add('hidden');
    else document.body.classList.add('cookie-visible');
    $$('.cookie-accept,.cookie-reject').forEach(b => b.addEventListener('click', () => {
      localStorage.setItem('nova-cookie', b.classList.contains('cookie-accept') ? 'accepted' : 'rejected');
      cookie.classList.add('hidden');
      document.body.classList.remove('cookie-visible');
    }));
  }

  /* Görsel yedek katmanı */
  $$('img').forEach(img => {
    const fail = () => {
      if (img.dataset.fallback && !img.dataset.localFallback) { img.dataset.localFallback = 'true'; img.src = img.dataset.fallback; return; }
      img.classList.add('image-fallback');
      img.parentElement?.classList.add('image-fallback');
    };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });
})();
