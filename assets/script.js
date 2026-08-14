document.querySelectorAll('.year-el').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Language toggle
const TITLES = {
  en: 'Chen Wang Sax Studio',
  zh: '王晨萨克斯管工作室',
};
const NAV_TOGGLE_LABELS = {
  en: 'Toggle navigation',
  zh: '切换导航菜单',
};
const BACK_TO_TOP_LABELS = {
  en: 'Back to top',
  zh: '返回顶部',
};

const langToggle = document.getElementById('langToggle');
const langToggleTarget = langToggle.querySelector('.lang-toggle-target');

function applyLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  document.title = TITLES[lang];

  document.querySelectorAll('.lang-en').forEach((el) => { el.hidden = lang !== 'en'; });
  document.querySelectorAll('.lang-zh').forEach((el) => { el.hidden = lang !== 'zh'; });

  langToggleTarget.textContent = lang === 'en' ? '中文' : 'EN';
  document.getElementById('navToggle').setAttribute('aria-label', NAV_TOGGLE_LABELS[lang]);
  document.getElementById('backToTop').setAttribute('aria-label', BACK_TO_TOP_LABELS[lang]);

  localStorage.setItem('lang', lang);
}

applyLang(document.documentElement.dataset.lang || 'en');

langToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.lang === 'en' ? 'zh' : 'en';
  applyLang(next);
});

const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Sticky header shadow + back-to-top visibility on scroll
const siteHeader = document.querySelector('.site-header');
const backToTop = document.getElementById('backToTop');
let ticking = false;

function onScroll() {
  const scrolled = window.scrollY > 40;
  siteHeader.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('show', window.scrollY > 500);
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
});
onScroll();

// Scroll-reveal for elements marked .reveal, staggered within grids
const staggerGroups = document.querySelectorAll('.audio-stack, .awards-grid');
staggerGroups.forEach((group) => {
  group.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.setProperty('--stagger', `${i * 0.12}s`);
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}
