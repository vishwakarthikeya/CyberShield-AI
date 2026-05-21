/**
 * CyberShield AI — Theme Module
 * Handles dark/light mode switching
 */

const Theme = {
  isDark: true,

  /**
   * Initialize theme from localStorage
   */
  init() {
    const savedTheme = Storage.loadTheme();
    if (savedTheme !== null) {
      this.isDark = savedTheme;
    } else {
      // Check system preference
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  },

  /**
   * Apply current theme to DOM
   */
  applyTheme() {
    if (this.isDark) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
    
    // Update toggle buttons
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-btn');
    themeToggles.forEach(toggle => {
      if (this.isDark) {
        toggle.classList.add('on');
      } else {
        toggle.classList.remove('on');
      }
    });
    
    // Update icon visibility
    const darkIcon = document.querySelector('.theme-icon-dark');
    const lightIcon = document.querySelector('.theme-icon-light');
    if (darkIcon && lightIcon) {
      if (this.isDark) {
        darkIcon.style.display = 'block';
        lightIcon.style.display = 'none';
      } else {
        darkIcon.style.display = 'none';
        lightIcon.style.display = 'block';
      }
    }
  },

  /**
   * Toggle between dark and light mode
   */
  toggle() {
    this.isDark = !this.isDark;
    this.applyTheme();
    Storage.saveTheme(this.isDark);
    Utils.showToast(this.isDark ? 'Dark mode enabled' : 'Light mode enabled');
  },

  /**
   * Get current theme state
   * @returns {boolean} True if dark mode
   */
  isDarkMode() {
    return this.isDark;
  }
};

window.Theme = Theme;