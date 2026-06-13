/**
 * CHEDI CSA Website - Animations & Scroll Effects
 * Handles scroll animations, fade-ins, and other visual effects
 */

// Intersection Observer for scroll animations
class ScrollAnimation {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after animation
          // this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
  }

  observe(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('observe');
      this.observer.observe(el);
    });
  }

  observeAll() {
    // Common selectors for elements that should animate on scroll
    const selectors = [
      '.section',
      '.card',
      '.seasonal-card',
      '[class*="feature"]',
      '[class*="step-"]'
    ];

    selectors.forEach((selector) => {
      this.observe(selector);
    });
  }
}

// Parallax scroll effect
class ParallaxScroll {
  constructor(selector, speed = 0.5) {
    this.element = document.querySelector(selector);
    this.speed = speed;

    if (this.element) {
      window.addEventListener('scroll', () => this.update());
    }
  }

  update() {
    if (!this.element) return;
    const scrolled = window.scrollY;
    const yPos = scrolled * this.speed;
    this.element.style.transform = `translateY(${yPos}px)`;
  }
}

// Smooth scroll to anchor
function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Counter animation (for stats)
class CounterAnimation {
  constructor(selector, duration = 2000, options = {}) {
    this.elements = document.querySelectorAll(selector);
    this.duration = duration;
    this.root = options.root || null;
    this.animated = new WeakSet();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animateOne(entry.target);
          this.animated.add(entry.target);
        }
      });
    }, { threshold: 0.4, root: this.root });

    this.elements.forEach((el) => observer.observe(el));
  }

  animateOne(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const increment = target / (this.duration / 16);
    let current = 0;

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString() + suffix;
        clearInterval(counter);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }
}

// Farmer Growth page animations
function initFarmerGrowthAnimations() {
  const farmerPage = document.getElementById('page-farmer');
  if (!farmerPage) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  farmerPage.querySelectorAll('.fg-reveal').forEach((el) => revealObserver.observe(el));

  if (farmerPage.querySelector('.fg-impact-num[data-target]')) {
    new CounterAnimation('.fg-impact-num[data-target]', 2000);
  }

  const parallaxEl = farmerPage.querySelector('.fg-hero-parallax');
  if (parallaxEl) {
    let ticking = false;
    const updateParallax = () => {
      if (!farmerPage.classList.contains('active')) return;
      const rect = farmerPage.querySelector('.fg-hero')?.getBoundingClientRect();
      if (!rect || rect.bottom < 0) return;
      const offset = Math.min(window.scrollY * 0.25, 120);
      parallaxEl.style.transform = `translateY(${offset}px)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
}

// Initialize all animations on page load
function initAnimations() {
  // Scroll animations
  const scrollAnim = new ScrollAnimation();
  scrollAnim.observeAll();

  // Smooth scrolling for anchors
  smoothScroll();

  // Counter animations (if present; fg-impact handled separately)
  if (document.querySelector('[data-target]:not(.fg-impact-num)')) {
    new CounterAnimation('[data-target]:not(.fg-impact-num)', 2000);
  }

  initFarmerGrowthAnimations();
}

// Export animations
window.Animations = {
  ScrollAnimation, ParallaxScroll, CounterAnimation,
  initAnimations, smoothScroll
};

// Auto-initialize animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
