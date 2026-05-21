/**
 * CyberShield AI — Speech Module
 * Handles speech recognition (input) and speech synthesis (output)
 */

const Speech = {
  recognition: null,
  isListening: false,
  synthesis: window.speechSynthesis,
  currentUtterance: null,
  isVoiceEnabled: true,

  /**
   * Initialize speech recognition
   */
  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-IN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      
      this.recognition.onstart = () => this.onStart();
      this.recognition.onresult = (event) => this.onResult(event);
      this.recognition.onerror = (event) => this.onError(event);
      this.recognition.onend = () => this.onEnd();
    }
    
    // Load voice preference
    this.isVoiceEnabled = Storage.loadVoiceEnabled();
    this.updateVoiceToggleUI();
  },

  /**
   * Start listening for voice input
   * @param {Function} onResultCallback - Callback for result
   */
  startListening(onResultCallback) {
    if (!this.recognition) {
      Utils.showToast('Speech recognition not supported in this browser');
      return false;
    }
    
    if (this.isListening) {
      this.stopListening();
      return false;
    }
    
    this.resultCallback = onResultCallback;
    
    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      Utils.showToast('Could not start microphone. Check permissions.');
      return false;
    }
  },

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    this.isListening = false;
    this.updateMicButtonUI(false);
  },

  onStart() {
    this.isListening = true;
    this.updateMicButtonUI(true);
    Utils.showToast('Listening... speak now');
  },

  onResult(event) {
    const transcript = event.results[0][0].transcript;
    if (this.resultCallback) {
      this.resultCallback(transcript);
    }
  },

  onError(event) {
    console.error('Speech recognition error:', event.error);
    let message = 'Microphone error';
    if (event.error === 'not-allowed') {
      message = 'Microphone access denied. Please allow microphone access.';
    } else if (event.error === 'no-speech') {
      message = 'No speech detected. Please try again.';
    }
    Utils.showToast(message);
    this.stopListening();
  },

  onEnd() {
    this.isListening = false;
    this.updateMicButtonUI(false);
  },

  updateMicButtonUI(isActive) {
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
      if (isActive) {
        micBtn.classList.add('listening');
      } else {
        micBtn.classList.remove('listening');
      }
    }
  },

  /**
   * Speak text using speech synthesis
   * @param {string} text - Text to speak
   */
  speak(text) {
    if (!this.isVoiceEnabled || !text) return;
    
    // Cancel any ongoing speech
    this.synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  },

  /**
   * Cancel current speech
   */
  cancel() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  },

  /**
   * Toggle voice responses on/off
   */
  toggleVoice() {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    Storage.saveVoiceEnabled(this.isVoiceEnabled);
    this.updateVoiceToggleUI();
    Utils.showToast(this.isVoiceEnabled ? 'Voice responses enabled' : 'Voice responses muted');
  },

  /**
   * Update voice toggle button UI
   */
  updateVoiceToggleUI() {
    const voiceToggle = document.getElementById('voice-toggle');
    if (voiceToggle) {
      if (this.isVoiceEnabled) {
        voiceToggle.classList.add('on');
      } else {
        voiceToggle.classList.remove('on');
      }
    }
  },

  /**
   * Check if voice is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.isVoiceEnabled;
  }
};

window.Speech = Speech;