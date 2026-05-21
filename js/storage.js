/**
 * CyberShield AI — Storage Module
 * Handles localStorage operations for chat history and settings
 */

const Storage = {
  /**
   * Save chat history to localStorage
   * @param {Array} history - Chat history array
   */
  saveHistory(history) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save history:', err);
      Utils.showToast('Failed to save chat history');
    }
  },

  /**
   * Load chat history from localStorage
   * @returns {Array} Chat history array
   */
  loadHistory() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Failed to load history:', err);
      return [];
    }
  },

  /**
   * Clear chat history from localStorage
   */
  clearHistory() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.HISTORY);
  },

  /**
   * Save theme preference
   * @param {boolean} isDark - True for dark mode
   */
  saveTheme(isDark) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  },

  /**
   * Load theme preference
   * @returns {boolean|null} True for dark, false for light, null for default
   */
  loadTheme() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return null;
  },

  /**
   * Save voice preference
   * @param {boolean} enabled - True if voice responses enabled
   */
  saveVoiceEnabled(enabled) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.VOICE_ENABLED, enabled.toString());
  },

  /**
   * Load voice preference
   * @returns {boolean} True if voice responses enabled
   */
  loadVoiceEnabled() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.VOICE_ENABLED);
    return saved !== 'false';
  },

  /**
   * Save history saving preference
   * @param {boolean} enabled - True if history saving enabled
   */
  saveHistoryEnabled(enabled) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.SAVE_HISTORY, enabled.toString());
  },

  /**
   * Load history saving preference
   * @returns {boolean} True if history saving enabled
   */
  loadHistoryEnabled() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.SAVE_HISTORY);
    return saved !== 'false';
  },

  /**
   * Save API key
   * @param {string} apiKey - Gemini API key
   */
  saveApiKey(apiKey) {
    if (apiKey && apiKey.trim()) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, apiKey.trim());
    }
  },

  /**
   * Load API key
   * @returns {string} API key or empty string
   */
  loadApiKey() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY) || '';
  },

  /**
   * Validate API key format (basic check)
   * @param {string} apiKey - API key to validate
   * @returns {boolean} True if format looks valid
   */
  isValidApiKey(apiKey) {
    return apiKey && apiKey.trim().startsWith('AIza') && apiKey.trim().length > 10;
  }
};

window.Storage = Storage;