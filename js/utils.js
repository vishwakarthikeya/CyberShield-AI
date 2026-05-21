/**
 * CyberShield AI — Utility Functions
 * Reusable helper functions
 */

const Utils = {
  /**
   * Sanitize string for HTML insertion
   * @param {string} str - Input string
   * @returns {string} Sanitized string
   */
  sanitize(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Escape string for HTML attribute
   * @param {string} str - Input string
   * @returns {string} Escaped string
   */
  escapeForAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '&quot;')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '');
  },

  /**
   * Escape string for HTML content
   * @param {string} str - Input string
   * @returns {string} Escaped string
   */
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /**
   * Format time from Date object
   * @param {Date} date - Date object
   * @returns {string} Formatted time (HH:MM)
   */
  formatTime(date) {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  },

  /**
   * Format date and time
   * @param {Date} date - Date object
   * @returns {string} Formatted date and time
   */
  formatDateTime(date) {
    return date.toLocaleString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },

  /**
   * Debounce function to limit rate of execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function to limit rate of execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds
   */
  showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  },

  /**
   * Auto-resize textarea
   * @param {HTMLTextAreaElement} textarea - Textarea element
   */
  autoResizeTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, CONFIG.MAX_INPUT_HEIGHT) + 'px';
  },

  /**
   * Scroll element to bottom
   * @param {HTMLElement} element - Element to scroll
   */
  scrollToBottom(element) {
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Check if string contains any of the keywords
   * @param {string} text - Input text
   * @param {string[]} keywords - Array of keywords
   * @returns {boolean} True if any keyword found
   */
  containsAny(text, keywords) {
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  },

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }
};

window.Utils = Utils;