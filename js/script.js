/* ===================================================
   Lake View Resort by J.V — Main JavaScript
   =================================================== */

(function () {
  'use strict';

  /* ── Navbar ──────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ── Active Nav Link ─────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage ||
      (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Hero Zoom ───────────────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  /* ── Scroll Reveal ───────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, entry.target.dataset.delay || 0);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el, i) => {
      if (!el.dataset.delay) {
        // Stagger siblings
        const parent = el.parentElement;
        const siblings = parent.querySelectorAll('.reveal');
        siblings.forEach((sib, idx) => {
          if (!sib.dataset.delay) sib.dataset.delay = idx * 90;
        });
      }
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ── Smooth Scroll ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Menu Tabs ───────────────────────────────── */
  const tabs = document.querySelectorAll('.menu-tab');
  const categories = document.querySelectorAll('.menu-category');

  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        categories.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  }

  /* ── Gallery Lightbox ────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');

  if (galleryItems.length && lightbox) {
    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');
    let currentIdx = 0;
    const images = [];

    galleryItems.forEach((item, i) => {
      const img = item.querySelector('img');
      if (img) images.push(img.src);

      item.addEventListener('click', () => {
        currentIdx = i;
        openLightbox(currentIdx);
      });
    });

    function openLightbox(idx) {
      lbImg.src = images[idx];
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);

    if (lbPrev) {
      lbPrev.addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + images.length) % images.length;
        openLightbox(currentIdx);
      });
    }

    if (lbNext) {
      lbNext.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % images.length;
        openLightbox(currentIdx);
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
      if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    });
  }

  /* ── Contact Form ────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = this.querySelector('[name="name"]').value.trim();
      const phone   = this.querySelector('[name="phone"]').value.trim();
      const message = this.querySelector('[name="message"]').value.trim();

      if (!name || !phone || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Build WhatsApp message
      const wa = `Hello! I'm ${name} (Phone: ${phone}).\n\n${message}`;
      const url = `https://wa.me/916006446624?text=${encodeURIComponent(wa)}`;

      // Show success
      const success = document.getElementById('formSuccess');
      if (success) {
        success.style.display = 'block';
        success.innerHTML = `<strong>Thank you, ${name}!</strong> Redirecting you to WhatsApp…`;
      }

      setTimeout(() => window.open(url, '_blank'), 1200);
    });
  }

  /* ── Counter Animation ───────────────────────── */
  const counters = document.querySelectorAll('.stat-num[data-target]');

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(c => counterObserver.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  /* ── Year in Footer ──────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
