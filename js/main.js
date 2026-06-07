(function () {
  'use strict';

  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const nav = document.getElementById('site-nav');
  const yearEl = document.getElementById('year');
  const themeColorMeta = document.getElementById('theme-color-meta');

  const THEME_COLORS = {
    dark: '#6366f1',
    light: '#f8fafc',
  };

  /* ── Theme ── */
  function setTheme(theme) {
    html.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', THEME_COLORS[theme]);
    }
    updateGitHubStatsTheme(theme);
  }

  function buildGitHubStatsUrl(username, theme) {
    const statsTheme = theme === 'dark' ? 'dracula' : 'default';
    const params = new URLSearchParams({
      username,
      count_private: 'true',
      show: 'reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage',
      show_icons: 'true',
      theme: statsTheme,
      line_height: '30',
    });
    return `https://github-stats.pavelpikta.com/api?${params.toString()}`;
  }

  function updateGitHubStatsTheme(theme) {
    document.querySelectorAll('[data-username]').forEach((img) => {
      img.src = buildGitHubStatsUrl(img.dataset.username, theme);
    });
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-bs-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  initTheme();

  /* ── Footer year ── */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Navbar scroll & active links ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);

    const scrollPos = window.scrollY + 140;
    let current = 'hero';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navMenu');
      if (collapse && collapse.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

  /* ── Keyboard support for feature cards ── */
  document.querySelectorAll('.feature-card[role="button"]').forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ── Reveal fallback ── */
  function showRevealElements() {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ── GSAP animations ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.site-nav', { y: -80, opacity: 0, duration: 0.8 })
      .from('.hero-badge', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-title', { y: 50, opacity: 0, duration: 0.8 }, '-=0.3')
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6 }, '-=0.5')
      .from('.hero-desc', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-actions .btn', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
      .from('.hero-visual', { scale: 0.8, opacity: 0, duration: 1, ease: 'back.out(1.4)' }, '-=0.8');

    gsap.to('.wave', {
      rotation: 14,
      duration: 0.4,
      repeat: 3,
      yoyo: true,
      ease: 'power1.inOut',
      delay: 1.2,
    });

    gsap.to('.hero-ring-1', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
      transformOrigin: 'center center',
    });

    gsap.to('.hero-ring-2', {
      rotation: -360,
      duration: 30,
      repeat: -1,
      ease: 'none',
      transformOrigin: 'center center',
    });

    gsap.to('.hero-float-1', { y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-float-2', { y: 10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
    gsap.to('.hero-float-3', { y: -8, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });

    gsap.to('.bg-blob-1', {
      x: 60,
      y: 40,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.bg-blob-2', {
      x: -50,
      y: -30,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.bg-blob-3', {
      x: 40,
      y: -50,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    document.querySelectorAll('.modal').forEach((modalEl) => {
      modalEl.addEventListener('show.bs.modal', () => {
        const dialog = modalEl.querySelector('.modal-dialog');
        gsap.fromTo(
          dialog,
          { y: 40, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: true }
        );
      });
    });

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  } else {
    showRevealElements();
  }
})();
