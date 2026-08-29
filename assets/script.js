document.querySelectorAll('.year-el').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Google Ads conversion tracking: carry the visitor's GA4 client ID through
// the embedded Google Form (as a hidden pre-filled field) so the Apps Script
// bound to the form can report a "submit_lead_form" conversion via the GA4
// Measurement Protocol on submit. The form is a cross-origin iframe, so this
// page can't detect a submission directly — passing the client ID through is
// the only bridge. GA4's own ad-click attribution (linked to Google Ads via
// auto-tagging) then credits the right ad click automatically; no need to
// handle gclid manually.
const GA_CLIENT_ID_ENTRY_PARAM = 'entry.1605451217'; // "Referral Tracking ID" field on the form

function getGaClientId() {
  const match = document.cookie.match(/(?:^|;\s*)_ga=GA\d\.\d\.(\d+\.\d+)/);
  return match ? match[1] : null;
}

(function threadClientIdIntoForm() {
  const formFrame = document.querySelector('.google-form-embed');
  if (!formFrame) return;

  function applyClientId() {
    if (formFrame.src.includes(GA_CLIENT_ID_ENTRY_PARAM)) return;
    const clientId = getGaClientId();
    if (!clientId) return;
    const separator = formFrame.src.includes('?') ? '&' : '?';
    formFrame.src += `${separator}${GA_CLIENT_ID_ENTRY_PARAM}=${encodeURIComponent(clientId)}`;
  }

  // Try immediately (gtag.js has usually finished long before a visitor
  // scrolls to the contact form) and again right before the lazily-loaded
  // iframe is about to enter the viewport, to give the GA cookie the best
  // possible chance of already being set.
  applyClientId();
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        applyClientId();
        obs.disconnect();
      }
    });
  }, { rootMargin: '600px' });
  observer.observe(formFrame);
})();

// Language switcher (English / Chinese / Spanish)
//
// Each URL serves exactly one language and says so statically in its own HTML
// (`<html lang="..." data-lang="...">`, one set of copy, a translated <head>).
// Nothing here rewrites page content or remembers a preference: the URL is the
// single source of truth, so "/" is always English, "/zh/" always Chinese and
// "/es/" always Spanish, for every visitor on every visit. The <select> simply
// navigates to the current page's counterpart in the chosen language.
const NAV_TOGGLE_LABELS = {
  en: 'Toggle navigation',
  zh: '切换导航菜单',
  es: 'Alternar navegación',
};
const BACK_TO_TOP_LABELS = {
  en: 'Back to top',
  zh: '返回顶部',
  es: 'Volver arriba',
};

const pageLang = document.documentElement.dataset.lang || 'en';
const langSelect = document.getElementById('langSelect');

document.getElementById('navToggle').setAttribute('aria-label', NAV_TOGGLE_LABELS[pageLang]);
document.getElementById('backToTop').setAttribute('aria-label', BACK_TO_TOP_LABELS[pageLang]);

if (langSelect) {
  langSelect.value = pageLang;
  langSelect.addEventListener('change', () => {
    const altUrl = window.ALT_LANG_URL && window.ALT_LANG_URL[langSelect.value];
    if (altUrl) {
      window.location.href = altUrl + window.location.hash;
    } else {
      langSelect.value = pageLang; // already on this language's URL
    }
  });
}

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
