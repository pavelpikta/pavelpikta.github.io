(function () {
  'use strict';

  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const nav = document.getElementById('site-nav');
  const yearEl = document.getElementById('year');
  const themeColorMeta = document.getElementById('theme-color-meta');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const config = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};

  const THEME_COLORS = { dark: '#6366f1', light: '#f8fafc' };

  function buildGitHubStatsUrl(type, username, theme) {
    const statsTheme = theme === 'dark' ? 'dracula' : 'default';
    const base = 'https://github-stats.pavelpikta.com';

    if (type === 'langs') {
      const params = new URLSearchParams({
        username,
        layout: 'compact',
        theme: statsTheme,
        hide_border: 'true',
        langs_count: '8',
        hide: 'jupyter notebook,shell',
      });
      return `${base}/api/top-langs/?${params.toString()}`;
    }

    const params = new URLSearchParams({
      username,
      count_private: 'true',
      show: 'reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage',
      show_icons: 'true',
      theme: statsTheme,
      hide_border: 'true',
      include_all_commits: 'true',
      rank_icon: 'percentile',
      line_height: '28',
    });
    return `${base}/api?${params.toString()}`;
  }

  function updateGitHubStatsTheme(theme) {
    document.querySelectorAll('[data-github-stat]').forEach((img) => {
      img.classList.remove('loaded');
      img.closest('.stats-panel')?.classList.remove('stats-panel-error');
      const skeleton = document.querySelector(`[data-skeleton-for="${img.id}"]`);
      skeleton?.classList.remove('hidden');
      img.onload = () => {
        img.classList.add('loaded');
        skeleton?.classList.add('hidden');
      };
      img.onerror = () => {
        skeleton?.classList.add('hidden');
        img.closest('.stats-panel')?.classList.add('stats-panel-error');
      };
      img.src = buildGitHubStatsUrl(img.dataset.githubStat, img.dataset.username, theme);
    });
  }

  function setTheme(theme) {
    html.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeColorMeta) themeColorMeta.setAttribute('content', THEME_COLORS[theme]);
    updateGitHubStatsTheme(theme);
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') setTheme(saved);
    else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  initTheme();

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const contactEmailLink = document.getElementById('contact-email-link');
  if (contactEmailLink && config.contactEmail) {
    contactEmailLink.href = `mailto:${config.contactEmail}`;
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (nav) nav.classList.toggle('scrolled', scrollY > 40);
    if (scrollProgress && docHeight > 0) scrollProgress.style.width = `${(scrollY / docHeight) * 100}%`;
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 500);

    const scrollPos = scrollY + 140;
    let current = 'hero';
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) current = section.getAttribute('id');
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navMenu');
      if (collapse?.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    });
  });

  async function loadGitHubProfile() {
    const bar = document.getElementById('github-profile-bar');
    const metricsEl = document.getElementById('github-metrics');
    if (!bar || !metricsEl) return;

    const username = config.githubUsername || 'pavelpikta';

    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error();
      const user = await res.json();

      const avatar = document.getElementById('github-profile-avatar');
      const name = document.getElementById('github-profile-name');
      const handle = document.getElementById('github-profile-handle');

      if (avatar) {
        avatar.src = user.avatar_url;
        avatar.alt = `${user.name || user.login} on GitHub`;
      }
      if (name) name.textContent = user.name || user.login;
      if (handle) {
        handle.textContent = `@${user.login}`;
        handle.href = user.html_url;
      }

      const metrics = [
        { icon: 'bi-folder2', label: 'Repos', value: user.public_repos },
        { icon: 'bi-people', label: 'Followers', value: user.followers },
        { icon: 'bi-person-plus', label: 'Following', value: user.following },
      ];

      metricsEl.innerHTML = metrics.map((m) => `
        <div class="github-metric">
          <i class="bi ${m.icon}"></i>
          <span class="github-metric-value">${m.value}</span>
          <span class="github-metric-label">${m.label}</span>
        </div>`).join('');

      bar.hidden = false;
    } catch {
      bar.hidden = true;
    }
  }

  loadGitHubProfile();

  if (config.cloudflareAnalyticsToken) {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token: config.cloudflareAnalyticsToken }));
    document.head.appendChild(script);
  }

  document.querySelectorAll('.feature-card[role="button"]').forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  function showRevealElements() {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  function animateRepos() {
    const grid = document.getElementById('repos-grid');
    if (!grid) return;
    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.utils.toArray('#repos-grid .reveal').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top 90%' },
          y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        });
      });
      ScrollTrigger.refresh();
    } else {
      grid.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  async function loadRepos() {
    const grid = document.getElementById('repos-grid');
    const loading = document.getElementById('repos-loading');
    if (!grid) return;

    const username = config.githubUsername || 'pavelpikta';

    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (!res.ok) throw new Error('Failed to fetch repos');
      const repos = await res.json();
      loading?.remove();

      repos.forEach((repo) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 reveal';
        const desc = (repo.description || 'No description provided.').replace(/</g, '&lt;');
        col.innerHTML = `
          <article class="repo-card">
            <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
            <p class="repo-desc">${desc}</p>
            <div class="repo-meta">
              ${repo.language ? `<span><i class="bi bi-circle-fill me-1" style="font-size:0.5rem;color:var(--bs-primary)"></i>${repo.language}</span>` : ''}
              <span><i class="bi bi-star me-1"></i>${repo.stargazers_count}</span>
              <span><i class="bi bi-diagram-2 me-1"></i>${repo.forks_count}</span>
            </div>
          </article>`;
        grid.appendChild(col);
      });

      animateRepos();
    } catch {
      if (loading) {
        loading.innerHTML = `<span class="text-muted-custom">Could not load repositories. <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer">View on GitHub</a></span>`;
      }
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.site-nav', { y: -80, opacity: 0, duration: 0.8 })
      .from('.hero-badge', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-title', { y: 50, opacity: 0, duration: 0.8 }, '-=0.3')
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6 }, '-=0.5')
      .from('.hero-desc', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-actions .btn', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
      .from('.hero-visual', { scale: 0.8, opacity: 0, duration: 1, ease: 'back.out(1.4)' }, '-=0.8');

    gsap.to('.wave', { rotation: 14, duration: 0.4, repeat: 3, yoyo: true, ease: 'power1.inOut', delay: 1.2 });
    gsap.to('.hero-ring-1', { rotation: 360, duration: 20, repeat: -1, ease: 'none', transformOrigin: 'center center' });
    gsap.to('.hero-ring-2', { rotation: -360, duration: 30, repeat: -1, ease: 'none', transformOrigin: 'center center' });
    gsap.to('.hero-float-1', { y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-float-2', { y: 10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
    gsap.to('.hero-float-3', { y: -8, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });

    [['.bg-blob-1', 60, 40, 12], ['.bg-blob-2', -50, -30, 15], ['.bg-blob-3', 40, -50, 18]].forEach(([sel, x, y, d]) => {
      gsap.to(sel, { x, y, duration: d, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });

    gsap.utils.toArray('.reveal').forEach((el) => {
      if (el.closest('#repos-grid')) return;
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
      });
    });

    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => { el.textContent = Math.round(counter.val) + suffix; },
      });
    });

    document.querySelectorAll('.modal').forEach((modalEl) => {
      modalEl.addEventListener('show.bs.modal', () => {
        const dialog = modalEl.querySelector('.modal-dialog');
        gsap.fromTo(dialog, { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: true });
      });
    });

    loadRepos();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  } else {
    showRevealElements();
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
    loadRepos();
  }
})();
