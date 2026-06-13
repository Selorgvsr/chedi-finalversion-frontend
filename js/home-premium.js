/**
 * CHEDI Premium Homepage – interactions & animations
 */
(function () {
  'use strict';

  var initialized = false;

  function initPageLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 1200);
    });
    setTimeout(function () {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 4000);
  }

  function initRevealAnimations() {
    var home = document.getElementById('page-home');
    if (!home) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    home.querySelectorAll('.hp-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initParallax() {
    var heroBg = document.querySelector('#page-home .hp-hero-bg');
    if (!heroBg) return;

    window.addEventListener('scroll', function () {
      var home = document.getElementById('page-home');
      if (!home || !home.classList.contains('active')) return;
      var offset = window.scrollY * 0.35;
      heroBg.style.transform = 'translateY(' + offset + 'px)';
    }, { passive: true });
  }

  function initHeroParticles() {
    var container = document.querySelector('#page-home .hp-hero-particles');
    if (!container || container.children.length > 0) return;

    for (var i = 0; i < 20; i++) {
      var p = document.createElement('div');
      p.className = 'hp-particle';
      var size = Math.random() * 6 + 2;
      p.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' +
        (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;' +
        'animation-duration:' + (Math.random() * 10 + 8) + 's;' +
        'animation-delay:' + (Math.random() * 5) + 's;opacity:' + (Math.random() * 0.5 + 0.2);
      container.appendChild(p);
    }
  }

  function initFinalLeaves() {
    var container = document.querySelector('#page-home .hp-final-leaves');
    if (!container || container.children.length > 0) return;

    for (var i = 0; i < 8; i++) {
      var leaf = document.createElement('span');
      leaf.className = 'hp-leaf';
      leaf.textContent = '🌿';
      leaf.style.left = (Math.random() * 100) + '%';
      leaf.style.animationDelay = (Math.random() * 12) + 's';
      leaf.style.animationDuration = (Math.random() * 8 + 10) + 's';
      container.appendChild(leaf);
    }
  }

  function initVideoLightbox() {
    var modal = document.getElementById('hp-video-modal');
    if (!modal || modal.dataset.bound === 'true') return;

    var player = modal.querySelector('.hp-video-modal-player');
    var triggers = document.querySelectorAll('#page-home .hp-video-showcase-video[data-vimeo-id]');
    var lastFocus = null;

    function openModal(vimeoId) {
      lastFocus = document.activeElement;
      player.innerHTML =
        '<iframe src="https://player.vimeo.com/video/' + vimeoId +
        '?title=0&byline=0&portrait=0&autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="CHEDI farm video"></iframe>';
      modal.hidden = false;
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
      });
      document.body.style.overflow = 'hidden';
      modal.querySelector('.hp-video-modal-close').focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (!modal.classList.contains('is-open')) {
          modal.hidden = true;
          player.innerHTML = '';
        }
      }, 350);
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-vimeo-id'));
      });
    });

    modal.querySelectorAll('[data-hp-video-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    modal.dataset.bound = 'true';
  }

  function init() {
    if (initialized) return;
    var home = document.getElementById('page-home');
    if (!home) return;

    initRevealAnimations();
    initParallax();
    initHeroParticles();
    initFinalLeaves();
    initVideoLightbox();
    initialized = true;
  }

  function onPageShow(pageId) {
    if (pageId === 'home') {
      init();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPageLoader();

    var home = document.getElementById('page-home');
    if (home && home.classList.contains('active')) {
      init();
    }
  });

  window.HomePremium = { init: init, onPageShow: onPageShow };
})();
