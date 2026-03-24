/* ═══════════════════════════════════════════════════════════
   TABERNA BOO GASTRONOMÍA — JavaScript Principal
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Año actual en footer ─── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── Referencias DOM ─── */
  const header      = document.getElementById('header');
  const navBtn      = document.querySelector('.js-open-nav');
  const mainNav     = document.getElementById('mainNav');
  const closeNavEls = document.querySelectorAll('.js-close-nav');

  /* ═══════════════════════════════════════════════
     NAVEGACIÓN — Abrir / cerrar menú lateral
  ═══════════════════════════════════════════════ */
  function openNav() {
    mainNav.classList.add('is-open');
    navBtn.classList.add('is-active');
    navBtn.setAttribute('aria-expanded', 'true');
    mainNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mainNav.classList.remove('is-open');
    navBtn.classList.remove('is-active');
    navBtn.setAttribute('aria-expanded', 'false');
    mainNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navBtn) {
    navBtn.addEventListener('click', function () {
      if (mainNav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  closeNavEls.forEach(function (el) {
    el.addEventListener('click', closeNav);
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('is-open')) {
      closeNav();
    }
  });

  /* ═══════════════════════════════════════════════
     HEADER — Cambio de estilo al hacer scroll
  ═══════════════════════════════════════════════ */
  let lastScroll = 0;

  function onScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ═══════════════════════════════════════════════
     PARALLAX SUAVE — Imagen del hero
  ═══════════════════════════════════════════════ */
  const heroImg = document.querySelector('.c-hero__img');

  if (heroImg && window.innerWidth > 768) {
    let rafId = null;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.c-hero').offsetHeight;

      if (scrollY <= heroHeight) {
        const offset = scrollY * 0.3;
        heroImg.style.transform = 'translateY(' + offset + 'px)';
      }

      rafId = null;
    }

    window.addEventListener('scroll', function () {
      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     REVEAL AL SCROLL — Intersection Observer
  ═══════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: mostrar todo si no hay soporte para IntersectionObserver
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ═══════════════════════════════════════════════
     SMOOTH SCROLL — Links de ancla
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      closeNav();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  /* ═══════════════════════════════════════════════
     BOTÓN DE RESERVA FLOTANTE — Ocultar en footer
  ═══════════════════════════════════════════════ */
  const reservaBtn  = document.querySelector('.c-reservation-btn');
  const footerEl    = document.querySelector('.c-footer');

  if (reservaBtn && footerEl && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reservaBtn.style.opacity = '0';
            reservaBtn.style.pointerEvents = 'none';
          } else {
            reservaBtn.style.opacity = '1';
            reservaBtn.style.pointerEvents = '';
          }
        });
      },
      { threshold: 0.1 }
    );

    footerObserver.observe(footerEl);
  }

  /* ═══════════════════════════════════════════════
     GALERÍA — Lightbox simple
  ═══════════════════════════════════════════════ */
  const galleryItems = document.querySelectorAll('.c-gallery__item');

  if (galleryItems.length > 0) {
    // Crear el lightbox
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Imagen ampliada');
    lightbox.style.cssText = [
      'display:none',
      'position:fixed',
      'inset:0',
      'z-index:200',
      'background:rgba(13,26,14,0.97)',
      'align-items:center',
      'justify-content:center',
      'padding:1.5rem',
      'cursor:zoom-out'
    ].join(';');

    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = [
      'max-width:92vw',
      'max-height:88vh',
      'object-fit:contain',
      'border-radius:8px',
      'box-shadow:0 24px 80px rgba(0,0,0,0.6)'
    ].join(';');
    lightboxImg.alt = '';

    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        const img = item.querySelector('img');
        if (!img) return;

        // Usar la imagen en resolución más alta
        const highResSrc = img.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=90');
        openLightbox(highResSrc, img.alt);
      });
    });

    lightbox.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });
  }

})();
