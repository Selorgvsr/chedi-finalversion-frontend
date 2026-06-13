/**
 * CHEDI CSA Website - Utility Functions
 * Shared helper functions for DOM manipulation and event handling
 */

// DOM Query helpers
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Event delegation
function on(element, event, selector, callback) {
  element.addEventListener(event, (e) => {
    if (e.target.matches(selector)) callback(e);
  });
}

// Class toggle helper
function toggleClass(element, className) {
  if (!element) return;
  element.classList.toggle(className);
}

// Add class helper
function addClass(element, className) {
  if (!element) return;
  element.classList.add(className);
}

// Remove class helper
function removeClass(element, className) {
  if (!element) return;
  element.classList.remove(className);
}

// Has class helper
function hasClass(element, className) {
  if (!element) return false;
  return element.classList.contains(className);
}

// Scroll to element
function scrollToElement(selector) {
  const element = $(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Get viewport height
function getViewportHeight() {
  return window.innerHeight;
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= getViewportHeight() &&
    rect.bottom >= 0
  );
}

// Debounce function
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

const CHEDI_BRAND_REGEX = /CHEDI(?:'s)?/g;

const CHEDI_BRAND_EXCLUDE = [
  '#main-header',
  '#mobileNavDrawer',
  '#mobileNavOverlay',
  'footer',
  'script',
  'style',
  'noscript',
  'title'
].join(', ');

function isChediBrandExcluded(node, excludeSelector) {
  let el = node.parentElement;
  while (el) {
    if (el.matches && el.matches(excludeSelector)) return true;
    if (el.classList && el.classList.contains('chedi-brand')) return true;
    el = el.parentElement;
  }
  return false;
}

function highlightChediBrand(root, options) {
  if (!root) return;

  const excludeSelector = (options && options.exclude) || CHEDI_BRAND_EXCLUDE;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      CHEDI_BRAND_REGEX.lastIndex = 0;
      if (!node.textContent || !CHEDI_BRAND_REGEX.test(node.textContent)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (isChediBrandExcluded(node, excludeSelector)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.textContent.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(function (node) {
    const text = node.textContent;
    CHEDI_BRAND_REGEX.lastIndex = 0;
    if (!CHEDI_BRAND_REGEX.test(text)) return;
    CHEDI_BRAND_REGEX.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = CHEDI_BRAND_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const span = document.createElement('span');
      span.className = 'chedi-brand';
      span.textContent = match[0];
      frag.appendChild(span);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode.replaceChild(frag, node);
  });
}

function highlightProjectsIframe() {
  const iframe = document.querySelector('.projects-ref-frame');
  if (!iframe) return;

  function apply() {
    try {
      const doc = iframe.contentDocument;
      if (doc && doc.body) {
        highlightChediBrand(doc.body, {
          exclude: '.nav, #navDrawer, footer, script, style, noscript, title'
        });
      }
    } catch (err) {
      /* same-origin only */
    }
  }

  iframe.addEventListener('load', apply);
  if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
    apply();
  }
}

// Export for use in other files
window.Utils = {
  $, $$, on, toggleClass, addClass, removeClass, hasClass,
  scrollToElement, getViewportHeight, isInViewport, debounce,
  highlightChediBrand, highlightProjectsIframe
};
