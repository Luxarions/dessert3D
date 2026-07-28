// Accordion.js - Modern Vanilla JavaScript with Icons
export function Accordion(options = {}) {
  const defaults = {
    selector: '.accordion',
    headerSelector: '.accordion-header',
    contentSelector: '.accordion-content',
    iconOpen: '−',
    iconClosed: '+',
    closeOthers: true,
    duration: 300,
    maxHeight: 220
  };

  const config = Object.assign({}, defaults, options);

  function createIcon(isOpen) {
    const span = document.createElement('span');
    span.className = 'accordion-icon';
    span.textContent = isOpen ? config.iconOpen : config.iconClosed;
    span.setAttribute('aria-hidden', 'true');
    return span;
  }

  function openAccordion(header, content, icon) {
    header.classList.add('active');
    header.setAttribute('aria-expanded', 'true');
    const maxH = config.maxHeight;
    content.style.maxHeight = typeof maxH === 'number' ? `${maxH}px` : maxH;
    content.style.overflowY = 'auto';
    content.style.opacity = '1';
    content.style.visibility = 'visible';
    icon.textContent = config.iconOpen;
    icon.style.transform = 'rotate(180deg)';
  }

  function closeAccordion(header, content, icon) {
    header.classList.remove('active');
    header.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = '0';
    content.style.overflowY = 'hidden';
    content.style.opacity = '0';
    content.style.visibility = 'hidden';
    icon.textContent = config.iconClosed;
    icon.style.transform = 'rotate(0deg)';
  }

  function toggle(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.accordion-icon');
    
    if (!content || !icon) return;

    const isOpen = header.classList.contains('active');

    if (config.closeOthers && !isOpen) {
      const allHeaders = document.querySelectorAll(config.headerSelector);
      allHeaders.forEach(h => {
        if (h !== header && h.classList.contains('active')) {
          const c = h.nextElementSibling;
          const i = h.querySelector('.accordion-icon');
          if (c && i) closeAccordion(h, c, i);
        }
      });
    }

    isOpen ? closeAccordion(header, content, icon) : openAccordion(header, content, icon);
  }

  function init(container) {
    const headers = container.querySelectorAll(config.headerSelector);
    
    headers.forEach(header => {
      const content = header.nextElementSibling;
      if (!content || !content.matches(config.contentSelector)) return;

      const existingIcon = header.querySelector('.accordion-icon');
      const icon = existingIcon || createIcon(false);
      if (!existingIcon) header.appendChild(icon);

      const isActive = header.classList.contains('active');
      if (isActive) {
        openAccordion(header, content, icon);
      } else {
        closeAccordion(header, content, icon);
      }

      header.addEventListener('click', function(e) {
        e.preventDefault();
        toggle(this);
      });

      header.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  function injectStyles() {
    if (document.getElementById('accordion-styles')) return;
    const style = document.createElement('style');
    style.id = 'accordion-styles';
    style.textContent = `
      .accordion-header {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: #151d2a;
        border: 1px solid #263346;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        width: 100%;
        text-align: left;
        transition: all 0.3s ease;
        gap: 12px;
        user-select: none;
        color: #f1f5f9;
      }

      .accordion-header:hover {
        background: #1e293b;
        border-color: #38bdf8;
      }

      .accordion-header:focus {
        outline: 2px solid #38bdf8;
        outline-offset: 2px;
        border-color: #38bdf8;
      }

      .accordion-header.active {
        background: #1e293b;
        border-color: #38bdf8;
        border-radius: 8px 8px 0 0;
      }

      .accordion-icon {
        font-size: 20px;
        font-weight: 300;
        line-height: 1;
        transition: transform 0.3s ease;
        flex-shrink: 0;
        color: #38bdf8;
        background: #0b0f19;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 1px solid #263346;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      .accordion-header.active .accordion-icon {
        background: #38bdf8;
        color: #0b0f19;
        border-color: #38bdf8;
        box-shadow: 0 2px 8px rgba(56,189,248,0.4);
      }

      .accordion-content {
        max-height: 0;
        opacity: 0;
        visibility: hidden;
        overflow: hidden;
        padding: 0 20px;
        border: 1px solid transparent;
        border-top: none;
        border-radius: 0 0 8px 8px;
        transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease, visibility 0.3s ease;
        background: #151d2a;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #cbd5e1;
        line-height: 1.6;
      }

      .accordion-content::-webkit-scrollbar {
        width: 6px;
      }
      .accordion-content::-webkit-scrollbar-track {
        background: #0b0f19;
        border-radius: 4px;
      }
      .accordion-content::-webkit-scrollbar-thumb {
        background: #263346;
        border-radius: 4px;
      }
      .accordion-content::-webkit-scrollbar-thumb:hover {
        background: #38bdf8;
      }

      .accordion-content[style*="max-height:"]:not([style*="max-height: 0"]) {
        padding: 20px;
        visibility: visible;
        opacity: 1;
        border-color: #263346;
      }

      .accordion-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 100%;
      }

      @media (prefers-reduced-motion: reduce) {
        .accordion-header, .accordion-content, .accordion-icon {
          transition: none !important;
        }
      }

      @media (max-width: 576px) {
        .accordion-header {
          padding: 12px 16px;
          font-size: 14px;
        }
        .accordion-icon {
          width: 28px;
          height: 28px;
          font-size: 18px;
        }
        .accordion-content[style*="max-height:"]:not([style*="max-height: 0"]) {
          padding: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (typeof document !== 'undefined') {
    injectStyles();
  }

  return {
    init: function(container) {
      if (typeof container === 'string') {
        const el = document.querySelector(container);
        if (el) init(el);
        return this;
      } else if (container instanceof HTMLElement) {
        init(container);
        return this;
      } else {
        document.querySelectorAll(config.selector).forEach(el => init(el));
        return this;
      }
    },

    open: function(header) {
      if (typeof header === 'string') header = document.querySelector(header);
      if (header && !header.classList.contains('active')) {
        header.click();
      }
      return this;
    },

    close: function(header) {
      if (typeof header === 'string') header = document.querySelector(header);
      if (header && header.classList.contains('active')) {
        header.click();
      }
      return this;
    },

    toggle: function(header) {
      if (typeof header === 'string') header = document.querySelector(header);
      if (header) header.click();
      return this;
    },

    destroy: function(container) {
      if (typeof container === 'string') container = document.querySelector(container);
      if (container) {
        const headers = container.querySelectorAll('.accordion-header');
        headers.forEach(header => {
          const clone = header.cloneNode(true);
          header.parentNode.replaceChild(clone, header);
        });
      }
      return this;
    }
  };
}

export default Accordion;
