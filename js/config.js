/**
 * CyberShield AI — Configuration Module
 * Centralized configuration and constants
 */

const CONFIG = {
  // API Configuration
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  GEMINI_LIST_MODELS: 'https://generativelanguage.googleapis.com/v1beta/models',
  
  // Alternative models
  GEMINI_ALTERNATIVES: [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite', 
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-flash-latest'
  ],
  
  // Generation Configuration - IMPROVED FOR BETTER RESPONSES
  GENERATION_CONFIG: {
    temperature: 0.35,
    maxOutputTokens: 2048,
    topP: 0.85,
    topK: 45
  },
  
  // Safety Settings
  SAFETY_SETTINGS: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
  ],
  
  // Storage Keys
  STORAGE_KEYS: {
    HISTORY: 'cybershield_history',
    THEME: 'cybershield_theme',
    VOICE_ENABLED: 'cybershield_voice_enabled',
    SAVE_HISTORY: 'cybershield_save_history',
    API_KEY: 'cybershield_api_key'
  },
  
  // UI Constants
  TYPING_DELAY: 500,
  MAX_HISTORY_ITEMS: 100,
  MAX_INPUT_HEIGHT: 120,
  
  // Emergency Keywords
  EMERGENCY_KEYWORDS: [
    'bank hacked', 'money deducted', 'upi fraud', 'otp shared', 'otp leaked',
    'account stolen', 'account hacked', 'blackmail', 'blackmailed', 'credit card fraud',
    'identity theft', 'ransom', 'ransomware', 'threatening', 'extortion',
    'money gone', 'funds deducted', 'unauthorized transaction', 'card cloned',
    'phishing', 'hacked my account', 'my account was hacked', 'atm fraud',
    'urgent', 'immediately', 'asap', 'morphed', 'morphing', 'fake profile',
    'impersonation', 'sextortion', 'nude', 'private photos'
  ],
  
  // Suggestion Chips
  SUGGESTIONS: [
    'My bank account was hacked and money is missing',
    'I accidentally shared my OTP with someone',
    'Someone created a fake Instagram profile of me',
    'UPI money got deducted without my authorization',
    'I\'m being blackmailed online with my private photos',
    'I received a phishing email asking for my password',
    'My social media account was hacked',
    'Someone is threatening to share my private information'
  ],
  
  // Feature List
  FEATURES: [
    { name: 'AI Chat Interface', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { name: 'Voice Input (Web Speech)', icon: 'M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2' },
    { name: 'Voice Output (TTS)', icon: 'M3 18v-6a9 9 0 0118 0v6 M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z' },
    { name: 'Emergency Detection', icon: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' },
    { name: 'PDF Report Download', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6' },
    { name: 'Dark / Light Mode', icon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' },
    { name: 'Chat History Saved', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5' },
    { name: 'Secure — No Backend', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }
  ]
};

window.CONFIG = CONFIG;