/**
 * Shawn Subin - Portfolio Script
 * Modern, dependency-free interactive engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollspy();
  initScrollAnimations();
  initBackToTop();
  initClipboard();
  initPulseWidget();
});

/* ==========================================================================
   THEME TOGGLER (PERSISTENT & SYSTEM PREFERENCE AWARE)
   ========================================================================== */
function initTheme() {
  const themeBtn = document.querySelector('#theme-btn');
  const themeColorMeta = document.querySelector('#theme-color-meta');
  
  // Check localStorage, then fallback to OS preference
  const savedTheme = localStorage.getItem('folio-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isCurrentlyDark = document.body.classList.contains('dark');
      const newTheme = isCurrentlyDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('folio-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // Listen to system changes if user hasn't set an explicit preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('folio-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#0C0F14');
      if (themeBtn) themeBtn.setAttribute('title', 'Switch to light mode');
    } else {
      document.body.classList.remove('dark');
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#2D6A4F');
      if (themeBtn) themeBtn.setAttribute('title', 'Switch to dark mode');
    }
  }
}

/* ==========================================================================
   NAVIGATION & MOBILE MENU DRAWER
   ========================================================================== */
function initNavigation() {
  const menuBtn = document.querySelector('#menu-btn');
  const mobileMenu = document.querySelector('#mobile-menu');
  const openIcon = document.querySelector('.menu-open-icon');
  const closeIcon = document.querySelector('.menu-close-icon');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!menuBtn || !mobileMenu) return;

  function toggleMenu(isOpen) {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !mobileMenu.classList.contains('open');
    if (shouldOpen) {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      if (openIcon) openIcon.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'block';
    } else {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      if (openIcon) openIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
    }
  }

  menuBtn.addEventListener('click', () => toggleMenu());

  // Close drawer when link clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close if clicked outside
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   SCROLLSPY (HIGHLIGHT ACTIVE NAV LINK)
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!sections.length) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS & PROGRESS BARS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!('IntersectionObserver' in window)) {
    // Fallback if not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
    animateProgressBars();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // If it's a skill category card, animate progress fills inside it
        const progressBars = entry.target.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-progress') || '80%';
          bar.style.width = targetWidth;
        });

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  progressBars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-progress') || '80%';
    bar.style.width = targetWidth;
  });
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const toTop = document.querySelector('#to-top');
  if (!toTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      toTop.classList.add('show');
    } else {
      toTop.classList.remove('show');
    }
  }, { passive: true });

  toTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   CLIPBOARD & TOAST NOTIFICATIONS
   ========================================================================== */
function initClipboard() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'shawnsubin@gmail.com';
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => showToast(`Copied ${email} to clipboard! 📋`))
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard! 📋`);
    } catch (err) {
      showToast(`Email: ${text}`);
    }
    document.body.removeChild(tempInput);
  }
}

let toastTimer = null;
function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ==========================================================================
   LIVE PULSE BOT WIDGET
   ========================================================================== */
function initPulseWidget() {
  const dateEl = document.querySelector('#pulse-date');
  const weatherEl = document.querySelector('#pulse-weather');
  const quoteEl = document.querySelector('#pulse-quote');
  const refreshBtn = document.querySelector('#fetch-pulse-btn');

  const fallbackQuotes = [
    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
    { q: "Simplicity is prerequisite for reliability.", a: "Edsger W. Dijkstra" },
    { q: "Code is like humor. When you have to explain it, it’s bad.", a: "Cory House" },
    { q: "First, solve the problem. Then, write the code.", a: "John Johnson" },
    { q: "Experience is the name everyone gives to their mistakes.", a: "Oscar Wilde" }
  ];

  function updateDate() {
    if (!dateEl) return;
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  async function fetchPulseData() {
    updateDate();

    if (weatherEl) weatherEl.textContent = "Fetching weather for Thiruvananthapuram...";
    if (quoteEl) quoteEl.textContent = "Fetching inspirational quote...";

    // 1. Weather
    try {
      const weatherController = new AbortController();
      const timeoutId = setTimeout(() => weatherController.abort(), 4000);
      
      const res = await fetch('https://wttr.in/Thiruvananthapuram?format=3', {
        signal: weatherController.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (weatherEl) weatherEl.textContent = text.trim();
      } else {
        throw new Error('Weather status error');
      }
    } catch (e) {
      if (weatherEl) weatherEl.textContent = "Thiruvananthapuram: ⛅ +29°C (Typical Coastal Tropical)";
    }

    // 2. Quote
    try {
      const quoteController = new AbortController();
      const timeoutId = setTimeout(() => quoteController.abort(), 4000);

      // Try fetching quote
      const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'), {
        signal: quoteController.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.contents);
        if (parsed && parsed[0]) {
          if (quoteEl) quoteEl.textContent = `“${parsed[0].q}” — ${parsed[0].a}`;
          return;
        }
      }
      throw new Error('Quote parse error');
    } catch (e) {
      const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      if (quoteEl) quoteEl.textContent = `“${randomFallback.q}” — ${randomFallback.a}`;
    }
  }

  // Initial trigger
  fetchPulseData();

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('loading');
      fetchPulseData().finally(() => {
        showToast('Pulse feed refreshed! ⚡');
        setTimeout(() => refreshBtn.classList.remove('loading'), 600);
      });
    });
  }
}