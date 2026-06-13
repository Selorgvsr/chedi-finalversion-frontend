/**
 * CHEDI CSA Website - Main Application File
 * Initializes all components and features
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('CHEDI CSA Website Initialized');

  // Initialize components
  if (window.Components && window.Components.initModals) {
    Components.initModals();
  }

  // Initialize animations
  if (window.Animations && window.Animations.initAnimations) {
    Animations.initAnimations();
  }

  // Set up any global event listeners
  initGlobalListeners();

  // Handle page navigation
  handlePageNavigation();

  // Highlight the active nav item for the current page
  initActiveNav();

  // Initialize mobile hamburger navigation
  initMobileNav();

  // Highlight CHEDI in page content (excludes navbar and footer)
  initChediBrandHighlight();
});

function initChediBrandHighlight() {
  if (!window.Utils || !window.Utils.highlightChediBrand) return;

  Utils.highlightChediBrand(document.body);
  if (Utils.highlightProjectsIframe) {
    Utils.highlightProjectsIframe();
  }
}

/**
 * Initialize global event listeners
 */
function initGlobalListeners() {
  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close any open modals
      Object.values(Components.modals || {}).forEach((modal) => {
        if (modal.modal && modal.modal.style.display === 'flex') {
          modal.close();
        }
      });
    }
  });

  // Handle responsive behavior
  handleResponsive();
  window.addEventListener('resize', debounce(handleResponsive, 250));
}

/**
 * Mobile hamburger navigation menu
 */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const modelToggle = document.getElementById('mobileModelToggle');
  const modelSubmenu = document.getElementById('mobileModelSubmenu');

  if (!hamburgerBtn || !mobileNavDrawer) return;

  function openMobileNav() {
    hamburgerBtn.classList.add('active');
    mobileNavDrawer.classList.add('open');
    if (mobileNavOverlay) mobileNavOverlay.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    if (mobileNavOverlay) mobileNavOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mobile-nav-open');
  }

  function closeNav() {
    hamburgerBtn.classList.remove('active');
    mobileNavDrawer.classList.remove('open');
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    if (mobileNavOverlay) mobileNavOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mobile-nav-open');
    if (modelToggle && modelSubmenu) {
      modelToggle.classList.remove('open');
      modelSubmenu.classList.remove('open');
      modelToggle.setAttribute('aria-expanded', 'false');
    }
  }

  window.closeMobileNav = closeNav;

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileNavDrawer.classList.contains('open')) {
      closeNav();
    } else {
      openMobileNav();
    }
  });

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeNav);
  }

  if (modelToggle && modelSubmenu) {
    modelToggle.addEventListener('click', () => {
      const isOpen = modelSubmenu.classList.toggle('open');
      modelToggle.classList.toggle('open', isOpen);
      modelToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.addEventListener('click', (e) => {
    if (!mobileNavDrawer.classList.contains('open')) return;
    const isInside = mobileNavDrawer.contains(e.target) || hamburgerBtn.contains(e.target);
    if (!isInside) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
      closeNav();
    }
  });

  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 1024 && mobileNavDrawer.classList.contains('open')) {
      closeNav();
    }
  }, 250));
}

/**
 * Handle responsive breakpoint changes
 */
function handleResponsive() {
  const width = window.innerWidth;

  if (width < 768) {
    document.body.classList.add('mobile');
    document.body.classList.remove('tablet', 'desktop');
  } else if (width < 1024) {
    document.body.classList.add('tablet');
    document.body.classList.remove('mobile', 'desktop');
  } else {
    document.body.classList.add('desktop');
    document.body.classList.remove('mobile', 'tablet');
  }
}

/**
 * Set active nav state on initial page load
 */
function initActiveNav() {
  if (!window.Components || !window.Components.updateActiveNav) return;

  const activePage = document.querySelector('.page.active');
  if (activePage) {
    Components.updateActiveNav(activePage.id.replace('page-', ''));
  }
}

/**
 * Handle page navigation (SPA mode)
 */
function handlePageNavigation() {
  // Set default page if not already set
  const pages = document.querySelectorAll('[id^="page-"]');
  if (pages.length > 0) {
    const firstPage = pages[0];
    if (firstPage && firstPage.style.display === 'none') {
      firstPage.style.display = 'block';
    }
  }

  // Handle navigation links
  document.querySelectorAll('a[data-page]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      Components.showPage(pageId);
    });
  });
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility function for onclick handlers in HTML
 * Can be called from onclick attributes: onclick="handleButtonClick(event, 'membership')"
 */
window.handleButtonClick = function (event, action) {
  event.preventDefault();

  if (action === 'membership') {
    Components.showPage('membership');
  } else if (action === 'contact') {
    Components.showPage('contact');
  } else if (action === 'land') {
    Components.showPage('land');
  }
};

/**
 * Global API for showing pages (backward compatibility)
 * This maintains compatibility with existing onclick="showPage('...')" handlers
 */
window.showPage = function (pageId) {
  Components.showPage(pageId);
  if (typeof window.closeMobileNav === 'function') {
    window.closeMobileNav();
  }
};

/**
 * Global API for closing modals
 */
window.closeModal = function (modalId) {
  if (Components.modals[modalId]) {
    Components.modals[modalId].close();
  }
};

/**
 * Global API for opening modals
 */
window.openModal = function (modalId) {
  if (Components.modals[modalId]) {
    Components.modals[modalId].open();
  }
};

// Export main app functions if needed by other scripts
window.App = {
  showPage: window.showPage,
  closeModal: window.closeModal,
  openModal: window.openModal
};
