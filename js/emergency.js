/**
 * CyberShield AI — Emergency Detection Module
 * Detects emergency situations and provides immediate guidance
 */

const Emergency = {
  /**
   * Check if message contains emergency keywords
   * @param {string} message - User message
   * @returns {boolean} True if emergency detected
   */
  detect(message) {
    return Utils.containsAny(message, CONFIG.EMERGENCY_KEYWORDS);
  },

  /**
   * Get severity level based on message content
   * @param {string} message - User message
   * @returns {string} Severity level (High, Medium, Low)
   */
  getSeverity(message) {
    const lowerMsg = message.toLowerCase();
    
    // High severity keywords
    const highKeywords = ['blackmail', 'extortion', 'ransom', 'threat', 'urgent', 'immediately'];
    if (Utils.containsAny(lowerMsg, highKeywords)) {
      return 'High';
    }
    
    // Medium severity keywords
    const mediumKeywords = ['otp', 'upi', 'deducted', 'fraud', 'hacked', 'stolen'];
    if (Utils.containsAny(lowerMsg, mediumKeywords)) {
      return 'Medium';
    }
    
    return 'Low';
  },

  /**
   * Get emergency banner HTML
   * @returns {string} HTML for emergency banner
   */
  getBannerHTML() {
    return `
      <div class="emergency-banner">
        <div class="emergency-banner-title">
          <div class="pulse-dot"></div>
          ⚠ HIGH PRIORITY DETECTED — ACT NOW
        </div>
        <div class="emergency-actions">
          <div class="em-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/></svg>
            Call Bank Now
          </div>
          <div class="em-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Freeze Cards
          </div>
          <div class="em-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Change Passwords
          </div>
          <div class="em-action">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/><circle cx="12" cy="12" r="10"/></svg>
            Call 1930 Helpline
          </div>
        </div>
      </div>
    `;
  }
};

window.Emergency = Emergency;