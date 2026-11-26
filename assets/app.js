/* ============================================================
   Shared interactions: language switch, progress, TOC highlight,
   mobile menu, back-to-top, figure lightbox
   ============================================================ */
(function () {
  'use strict';
  var body = document.body;
  var btn = document.getElementById('langBtn');

  /* --- bilingual switch (persisted across the two pages) --- */
  try {
    if (localStorage.getItem('fvcLang') === 'en') {
      body.classList.add('lang-en');
      if (btn) btn.textContent = '中文';
      document.documentElement.lang = 'en';
    }
  } catch (e) { /* storage unavailable */ }

  window.toggleLang = function () {
    var en = body.classList.toggle('lang-en');
    try { localStorage.setItem('fvcLang', en ? 'en' : 'zh'); } catch (e) {}
    if (btn) btn.textContent = en ? '中文' : 'EN';
    document.documentElement.lang = en ? 'en' : 'zh-CN';
  };

  /* --- mobile nav --- */
  window.toggleNav = function () {
    var links = document.querySelector('.lab-nav-links');
    if (links) links.classList.toggle('open');
  };
  document.querySelectorAll('.lab-nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      var links = document.querySelector('.lab-nav-links');
      if (links) links.classList.remove('open');
    });
  });

  /* --- reading progress + back to top --- */
  var bar = document.querySelector('.progress');
  var backtop = document.querySelector('.backtop');
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    if (bar) bar.style.width = p + '%';
    if (backtop) backtop.classList.toggle('show', window.scrollY > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  if (backtop) {
    backtop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- table of contents: active section --- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  var targets = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('active'); });
        var match = links.find(function (l) {
          return l.getAttribute('href') === '#' + e.target.id;
        });
        if (match) match.classList.add('active');
      });
    }, { rootMargin: '-12% 0px -78% 0px', threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* --- figure lightbox --- */
  var lb = document.createElement('div');
  lb.setAttribute('aria-hidden', 'true');
  lb.style.cssText = 'position:fixed;inset:0;z-index:200;background:rgba(10,25,33,.92);' +
    'display:none;align-items:center;justify-content:center;padding:28px;cursor:zoom-out;';
  var lbImg = document.createElement('img');
  lbImg.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;border:1px solid rgba(255,255,255,.25);';
  lb.appendChild(lbImg);
  document.body.appendChild(lb);
  lb.addEventListener('click', function () {
    lb.style.display = 'none';
    lb.setAttribute('aria-hidden', 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { lb.style.display = 'none'; }
  });
  document.querySelectorAll('.fig img, .photo-grid img, .photo-strip img, .hero-figure img').forEach(function (im) {
    im.style.cursor = 'zoom-in';
    im.addEventListener('click', function () {
      lbImg.src = im.currentSrc || im.src;
      lbImg.alt = im.alt || '';
      lb.style.display = 'flex';
      lb.setAttribute('aria-hidden', 'false');
    });
  });

  /* --- external links open in a new tab --- */
  document.querySelectorAll('a[href^="http"]').forEach(function (a) {
    if (!a.hasAttribute('target')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
})();
