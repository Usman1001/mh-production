/* =========================================================================
   MH PRODUCTION & ENTERTAINMENT — script.js
   Shared front-end behaviour for every page:
   - sticky navbar state on scroll
   - mobile menu close-on-link
   - scroll-triggered reveal animations
   - animated statistic counters
   - back-to-top control
   - portfolio category filtering (portfolio.html only)
   - contact form validation & submission (contact.html only)
   - active nav link + footer year
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

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth >= 992) return;
      var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
      if (bsCollapse) bsCollapse.hide();
    });
  });
}

/* -------------------------------------------------------------------------
   Active nav link — flags the current page in the navbar automatically
   ------------------------------------------------------------------------- */
function initActiveNavLink() {
  var links = document.querySelectorAll('.navbar-nav .nav-link');
  if (!links.length) return;

  var path = window.location.pathname.split('?')[0].split('#')[0];
  var current = path.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    
    var cleanHref = href.replace(/^\.\//, '');
    
    link.classList.remove('active');
    if (cleanHref === current || (current === '' && cleanHref === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* -------------------------------------------------------------------------
   Scroll reveal — fades/lifts elements with the `.reveal` class into view
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
      var eased = 1 - Math.pow(1 - progress, 3);
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
   Portfolio filter — shows/hides manifest cards and section groups safely
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
        
        // Defensive wrapper check preventing null element access error
        var wrapper = card.closest('.col-6, .col-md-4, .col-lg-3') || card.parentElement || card;
        if (wrapper) {
          wrapper.style.display = show ? '' : 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------
   Contact form — client-side validation before sending data
   ------------------------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');

  form.addEventListener('submit', function (e) {
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

    if (!isValid) {
      e.preventDefault(); // Stop submission only if fields are missing or invalid
      if (status) {
        status.textContent = 'Please complete the required fields marked above.';
        status.classList.remove('ok');
        status.classList.add('err', 'show');
      }
      return;
    }

    // Allow default form action to post to backend endpoint (FormSubmit/PHP)
    if (!form.getAttribute('action')) {
      e.preventDefault();
      if (status) {
        status.classList.remove('err');
        status.textContent = 'Thank you — your message has been received.';
        status.classList.add('ok', 'show');
      }
      form.reset();
    }
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

/* =========================================================
   PAGE LOADER
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const loader = document.getElementById("pageLoader");

  if (!loader) return;

  window.addEventListener("load", function () {

    // Keep the cinematic intro visible briefly
    setTimeout(function () {

      loader.classList.add("loaded");

      // Remove it completely after fade-out
      setTimeout(function () {
        loader.remove();
      }, 900);

    }, 1800);

  });

});