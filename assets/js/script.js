/* =========================================================================
   MH PRODUCTION & ENTERTAINMENT — script.js
   Shared front-end behaviour for every page:
   - sticky navbar state on scroll
   - mobile menu close-on-link
   - scroll-triggered reveal animations
   - animated statistic counters
   - back-to-top control
   - portfolio category filtering (portfolio.html only)
   - contact form validation (contact.html only)
   - active nav link + footer year
   All code is defensive: every feature checks that its markup exists
   before running, so this single file can be shared across all pages.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initNavbarScroll();
  initMobileMenuClose();
  initActiveNavLink();
  initScrollReveal();
  initCounters();
  initBackToTop();
  initPortfolioFilter();
  initContactForm();
  initFooterYear();
});

/* -------------------------------------------------------------------------
   Sticky navbar — adds a background once the page scrolls past the hero
   ------------------------------------------------------------------------- */
function initNavbarScroll() {
  var nav = document.getElementById('mainNav');
  if (!nav) return;

  function update() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* -------------------------------------------------------------------------
   Mobile menu — collapse the Bootstrap navbar after a link is tapped
   ------------------------------------------------------------------------- */
function initMobileMenuClose() {
  var collapseEl = document.getElementById('navMain');
  if (!collapseEl || typeof bootstrap === 'undefined') return;

  var links = collapseEl.querySelectorAll('.nav-link');
  var bsCollapse = null;

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth >= 992) return;
      bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
      bsCollapse.hide();
    });
  });
}

/* -------------------------------------------------------------------------
   Active nav link — flags the current page in the navbar automatically
   ------------------------------------------------------------------------- */
function initActiveNavLink() {
  var links = document.querySelectorAll('.navbar-nav .nav-link');
  if (!links.length) return;

  var current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    link.classList.remove('active');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* -------------------------------------------------------------------------
   Scroll reveal — fades/lifts elements with the `.reveal` class into view
   using IntersectionObserver; falls back to showing everything immediately
   if the API isn't available.
   ------------------------------------------------------------------------- */
function initScrollReveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el) { observer.observe(el); });
}

/* -------------------------------------------------------------------------
   Animated counters — reads target value + optional suffix from data
   attributes and counts up once the block scrolls into view.
   Markup: <span class="stat-num" data-count="40" data-suffix="+">0</span>
   ------------------------------------------------------------------------- */
function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* ease-out-cubic */
      var value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
}

/* -------------------------------------------------------------------------
   Back to top button
   ------------------------------------------------------------------------- */
function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  function toggle() {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------------------------------------------------
   Portfolio filter — shows/hides manifest cards and section groups by
   data-category. Only runs on portfolio.html where the markup exists.
   ------------------------------------------------------------------------- */
function initPortfolioFilter() {
  var filterBar = document.querySelector('.filter-bar');
  if (!filterBar) return;

  var buttons = filterBar.querySelectorAll('.filter-btn');
  var groups = document.querySelectorAll('[data-portfolio-group]');
  var cards = document.querySelectorAll('.manifest-card[data-category]');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      groups.forEach(function (group) {
        var groupCategory = group.getAttribute('data-portfolio-group');
        var show = filter === 'all' || filter === groupCategory;
        group.style.display = show ? '' : 'none';
      });

      cards.forEach(function (card) {
        var cardCategory = card.getAttribute('data-category');
        var show = filter === 'all' || filter === cardCategory;
        card.closest('.col-6, .col-md-4, .col-lg-3').style.display = show ? '' : 'none';
      });
    });
  });
}

/* -------------------------------------------------------------------------
   Contact form — lightweight client-side validation and a friendly status
   message. No backend is wired up yet; this is ready for a future PHP
   endpoint (see README.md) that would receive the same field names.
   ------------------------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.querySelector('#name');
    var email = form.querySelector('#email');
    var message = form.querySelector('#message');
    var isValid = true;

    [name, email, message].forEach(function (field) {
      if (field) field.classList.remove('is-invalid');
    });

    if (!name || !name.value.trim()) {
      isValid = false;
      if (name) name.classList.add('is-invalid');
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email.value.trim())) {
      isValid = false;
      if (email) email.classList.add('is-invalid');
    }

    if (!message || !message.value.trim()) {
      isValid = false;
      if (message) message.classList.add('is-invalid');
    }

    if (!status) return;

    status.classList.remove('ok', 'err');

    if (!isValid) {
      status.textContent = 'Please complete the required fields marked above.';
      status.classList.add('err', 'show');
      return;
    }

    /* Placeholder success flow. Swap this block for a fetch() call to a
       PHP/MySQL endpoint when the backend is ready. */
    status.textContent = 'Thank you — your message has been received. Our team will respond within 1–2 business days.';
    status.classList.add('ok', 'show');
    form.reset();
  });
}

/* -------------------------------------------------------------------------
   Footer year
   ------------------------------------------------------------------------- */
function initFooterYear() {
  var yearEl = document.getElementById('year');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}
