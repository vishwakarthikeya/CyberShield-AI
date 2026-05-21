/**
 * CyberShield AI — Main Application Module
 * Orchestrates all modules and handles main application flow
 */

const CyberShield = {
  // State
  chatHistory: [],
  isProcessing: false,
  
  // DOM Elements
  elements: {
    chatMessages: null,
    userInput: null,
    sendBtn: null,
    micBtn: null,
    sidebar: null,
    sidebarOverlay: null
  },
  
  /**
   * Initialize the application
   */
  async init() {
    // Initialize modules
    Theme.init();
    Speech.init();
    UI.init();
    
    // Cache DOM elements
    this.cacheElements();
    
    // Load data
    this.loadState();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Render initial UI
    this.renderHistoryPanel();
    
    // Check for API key
    const apiKey = Storage.loadApiKey();
    if (!apiKey) {
      Utils.showToast('⚠️ Please add your Gemini API key in Settings', 5000);
    } else if (!Storage.isValidApiKey(apiKey)) {
      Utils.showToast('⚠️ Invalid API key format. Please check Settings.', 5000);
    }
    
    console.log('CyberShield AI initialized');
  },
  
  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      chatMessages: document.getElementById('chat-messages'),
      userInput: document.getElementById('user-input'),
      sendBtn: document.getElementById('send-btn'),
      micBtn: document.getElementById('mic-btn'),
      sidebar: document.getElementById('sidebar'),
      sidebarOverlay: document.getElementById('sidebar-overlay'),
      historyList: document.getElementById('history-list')
    };
  },
  
  /**
   * Load state from storage
   */
  loadState() {
    if (Storage.loadHistoryEnabled()) {
      this.chatHistory = Storage.loadHistory();
    }
  },
  
  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Send button
    if (this.elements.sendBtn) {
      this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
    }
    
    // User input
    if (this.elements.userInput) {
      this.elements.userInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
      this.elements.userInput.addEventListener('input', () => Utils.autoResizeTextarea(this.elements.userInput));
    }
    
    // Microphone button
    if (this.elements.micBtn) {
      this.elements.micBtn.addEventListener('click', () => this.toggleMic());
    }
    
    // Theme toggles
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-btn');
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => Theme.toggle());
    });
    
    // Voice toggle
    const voiceToggle = document.getElementById('voice-toggle');
    if (voiceToggle) {
      voiceToggle.addEventListener('click', () => Speech.toggleVoice());
    }
    
    // History toggle
    const historyToggle = document.getElementById('history-toggle');
    if (historyToggle) {
      historyToggle.addEventListener('click', () => this.toggleHistorySave());
    }
    
    // API key save
    const apiSaveBtn = document.getElementById('api-save-btn');
    if (apiSaveBtn) {
      apiSaveBtn.addEventListener('click', () => this.saveApiKey());
    }
    
    // Clear chat buttons
    const clearBtns = document.querySelectorAll('#clear-chat-btn, #settings-clear-btn');
    clearBtns.forEach(btn => {
      btn.addEventListener('click', () => this.clearChat());
    });
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleSidebar());
    }
    
    // Sidebar overlay
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.addEventListener('click', () => this.closeSidebar());
    }
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn[data-panel]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const panel = btn.getAttribute('data-panel');
        if (panel) this.switchPanel(panel);
      });
    });
    
    // Load API key into input
    const apiInput = document.getElementById('api-key-input');
    if (apiInput) {
      apiInput.value = Storage.loadApiKey();
    }
  },
  
  /**
   * Handle key press in input
   * @param {KeyboardEvent} e 
   */
  handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  },
  
  /**
   * Send user message to AI
   */
  async sendMessage() {
    const text = this.elements.userInput.value.trim();
    if (!text || this.isProcessing) return;
    
    const apiKey = Storage.loadApiKey();
    if (!apiKey) {
      Utils.showToast('⚠️ Please add your Gemini API key in Settings');
      this.switchPanel('settings');
      return;
    }
    
    if (!Storage.isValidApiKey(apiKey)) {
      Utils.showToast('⚠️ Invalid API key format. Key should start with "AIza..."');
      this.switchPanel('settings');
      return;
    }
    
    // Clear input
    this.elements.userInput.value = '';
    Utils.autoResizeTextarea(this.elements.userInput);
    
    const timestamp = new Date();
    
    // Add user message to UI
    UI.addUserMessage(text, timestamp);
    
    // Save to history
    this.addToHistory('user', text, timestamp);
    
    // Check for emergency
    if (Emergency.detect(text)) {
      UI.addEmergencyBanner();
    }
    
    // Show typing indicator
    const typingId = UI.addTypingIndicator();
    this.isProcessing = true;
    if (this.elements.sendBtn) this.elements.sendBtn.disabled = true;
    
    try {
      // Call API
      const response = await API.callGemini(text, apiKey);
      
      // Remove typing indicator
      UI.removeTypingIndicator(typingId);
      
      // Add bot response
      UI.addBotResponse(response, text, new Date());
      
      // Save to history
      this.addToHistory('assistant', JSON.stringify(response), new Date());
      
      // Voice output if enabled
      if (Speech.isEnabled()) {
        const speechText = Prompts.extractPlainText(response);
        Speech.speak(speechText);
      }
      
    } catch (error) {
      console.error('Send message error:', error);
      UI.removeTypingIndicator(typingId);
      
      let errorMsg = error.message || 'Failed to get response from AI.';
      if (errorMsg.includes('API key')) {
        errorMsg = 'Invalid API key. Please check your API key in Settings.';
      } else if (errorMsg.includes('quota')) {
        errorMsg = 'API quota exceeded. Please check your Google Cloud billing.';
      } else if (errorMsg.includes('model')) {
        errorMsg = 'Model not available. Please try again later.';
      }
      UI.addErrorMessage(errorMsg);
    } finally {
      this.isProcessing = false;
      if (this.elements.sendBtn) this.elements.sendBtn.disabled = false;
      if (this.elements.userInput) this.elements.userInput.focus();
    }
  },
  
  /**
   * Add message to history
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   * @param {Date} timestamp - Message timestamp
   */
  addToHistory(role, content, timestamp) {
    if (!Storage.loadHistoryEnabled()) return;
    
    this.chatHistory.push({
      role: role,
      content: content,
      timestamp: timestamp.toISOString()
    });
    
    // Limit history size
    if (this.chatHistory.length > CONFIG.MAX_HISTORY_ITEMS * 2) {
      this.chatHistory = this.chatHistory.slice(-CONFIG.MAX_HISTORY_ITEMS * 2);
    }
    
    Storage.saveHistory(this.chatHistory);
    this.renderHistoryPanel();
  },
  
  /**
   * Render history panel
   */
  renderHistoryPanel() {
    UI.renderHistoryPanel(this.chatHistory);
  },
  
  /**
   * Clear all chat history
   */
  clearChat() {
    if (!confirm('Clear all chat history? This cannot be undone.')) return;
    
    this.chatHistory = [];
    Storage.clearHistory();
    UI.clearChat();
    this.renderHistoryPanel();
    Utils.showToast('Chat history cleared');
  },
  
  /**
   * Fill input from history
   * @param {string} text 
   */
  fillFromHistory(text) {
    this.switchPanel('home');
    if (this.elements.userInput) {
      this.elements.userInput.value = text;
      Utils.autoResizeTextarea(this.elements.userInput);
      this.elements.userInput.focus();
    }
    Utils.showToast('Loaded from history');
  },
  
  /**
   * Save API key
   */
  async saveApiKey() {
    const apiInput = document.getElementById('api-key-input');
    if (!apiInput) return;
    
    const key = apiInput.value.trim();
    if (!key) {
      Utils.showToast('Please enter an API key');
      return;
    }
    
    if (!Storage.isValidApiKey(key)) {
      Utils.showToast('Invalid API key format. It should start with "AIza..."');
      return;
    }
    
    // Test the API key
    Utils.showToast('Testing API key...');
    const testResult = await API.testApiKey(key);
    
    if (testResult.valid) {
      Storage.saveApiKey(key);
      Utils.showToast('API key saved and verified!');
    } else {
      Utils.showToast(`API key test failed: ${testResult.message}`);
    }
  },
  
  /**
   * Toggle history saving
   */
  toggleHistorySave() {
    const enabled = !Storage.loadHistoryEnabled();
    Storage.saveHistoryEnabled(enabled);
    
    const toggle = document.getElementById('history-toggle');
    if (toggle) {
      if (enabled) toggle.classList.add('on');
      else toggle.classList.remove('on');
    }
    
    if (!enabled) {
      this.chatHistory = [];
    } else {
      this.chatHistory = Storage.loadHistory();
      this.renderHistoryPanel();
    }
    
    Utils.showToast(enabled ? 'Chat history saving enabled' : 'Chat history saving disabled');
  },
  
  /**
   * Toggle microphone
   */
  toggleMic() {
    Speech.startListening((transcript) => {
      if (this.elements.userInput) {
        this.elements.userInput.value = transcript;
        Utils.autoResizeTextarea(this.elements.userInput);
        // Auto-send after voice input
        this.sendMessage();
      }
    });
  },
  
  /**
   * Switch between panels
   * @param {string} panel - Panel ID ('home', 'history', 'emergency', 'settings', 'about')
   */
  switchPanel(panel) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-panel') === panel) {
        btn.classList.add('active');
      }
    });
    
    // Update panels
    document.querySelectorAll('.panel').forEach(p => {
      p.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(`panel-${panel}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
    
    // Refresh history panel if needed
    if (panel === 'history') {
      this.renderHistoryPanel();
    }
    
    this.closeSidebar();
  },
  
  /**
   * Toggle sidebar (mobile)
   */
  toggleSidebar() {
    if (this.elements.sidebar) {
      this.elements.sidebar.classList.toggle('open');
    }
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.classList.toggle('show');
    }
  },
  
  /**
   * Close sidebar (mobile)
   */
  closeSidebar() {
    if (this.elements.sidebar) {
      this.elements.sidebar.classList.remove('open');
    }
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.classList.remove('show');
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  CyberShield.init();
});

// Expose necessary functions globally
window.CyberShield = CyberShield;
window.switchPanel = (panel) => CyberShield.switchPanel(panel);
window.toggleTheme = () => Theme.toggle();
window.toggleVoice = () => Speech.toggleVoice();
window.clearChat = () => CyberShield.clearChat();
window.toggleMic = () => CyberShield.toggleMic();
window.sendMessage = () => CyberShield.sendMessage();
window.saveApiKey = () => CyberShield.saveApiKey();
window.fillFromHistory = (text) => CyberShield.fillFromHistory(text);
window.toggleSidebar = () => CyberShield.toggleSidebar();
window.closeSidebar = () => CyberShield.closeSidebar();