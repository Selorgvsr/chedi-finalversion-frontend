/**
 * CHEDI CSA Website - Component Logic
 * Handles interactive components like modals, navigation, etc.
 */

// Modal Management
class Modal {
  constructor(selector) {
    this.modal = document.querySelector(selector);
    if (!this.modal) return;

    this.closeBtn = this.modal.querySelector('[class*="close"]');
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open() {
    if (this.modal) {
      this.modal.classList.add('active');
      this.modal.style.display = 'flex';
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('active');
      this.modal.style.display = 'none';
    }
  }

  toggle() {
    if (this.modal) {
      if (this.modal.style.display === 'flex') {
        this.close();
      } else {
        this.open();
      }
    }
  }
}

// Global modal instances
const modals = {};

// Initialize modals
function initModals() {
  const modalElements = document.querySelectorAll('[id$="Modal"]');
  modalElements.forEach((modal) => {
    modals[modal.id] = new Modal(`#${modal.id}`);
  });
}

const NAV_PAGE_IDS = new Set(['home', 'csa', 'land', 'farmer', 'projects', 'about', 'contact']);

const NAV_PAGE_MAP = {
  'farm-listing': 'projects',
  'project-details': 'projects'
};

function resolveNavPage(pageId) {
  if (NAV_PAGE_MAP[pageId]) return NAV_PAGE_MAP[pageId];
  if (NAV_PAGE_IDS.has(pageId)) return pageId;
  return null;
}

function updateActiveNav(pageId) {
  const navPage = resolveNavPage(pageId);
  document.querySelectorAll('[data-nav-page]').forEach((link) => {
    link.classList.toggle('active', navPage !== null && link.dataset.navPage === navPage);
  });
}

// Page navigation (SPA-style)
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('[id^="page-"]').forEach((page) => {
    page.style.display = 'none';
    page.classList.remove('active');
  });

  // Show selected page
  const page = document.getElementById(`page-${pageId}`);
  if (page) {
    page.style.display = 'block';
    page.classList.add('active');
    window.scrollTo(0, 0);
  }

  updateActiveNav(pageId);

  if (window.HomePremium && window.HomePremium.onPageShow) {
    window.HomePremium.onPageShow(pageId);
  }
}

// Navigation menu toggle (if needed)
function toggleMenu(selector) {
  const menu = document.querySelector(selector);
  if (menu) {
    menu.classList.toggle('active');
  }
}

// Export components
window.Components = {
  Modal, modals, initModals, showPage, updateActiveNav, toggleMenu
};
