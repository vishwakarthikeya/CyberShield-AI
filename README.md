# CyberShield AI — Cybercrime Assistance Chatbot

## Overview

CyberShield AI is an AI-powered cybercrime assistance chatbot designed to help ordinary people understand and respond to cybercrime incidents. It uses Google Gemini AI to analyze user situations and provide actionable guidance, emergency detection, and official helpline information.

## Features

-  **AI Chat Interface** - Natural conversation with Gemini AI
-  **Voice Input** - Speech recognition for hands-free interaction
-  **Voice Output** - Text-to-speech for AI responses
-  **Emergency Detection** - Automatic detection of urgent situations
-  **Structured Analysis** - Crime type, confidence, severity, immediate actions
-  **Chat History** - Local storage of conversation history
-  **PDF Reports** - Download incident reports
-  **Dark/Light Mode** - Theme switching
-  **Responsive Design** - Works on all devices
-  **Privacy First** - No backend, all data stays on your device

## Tech Stack

- HTML5
- CSS3 (with CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Google Gemini API (Gemini 1.5 Flash)
- Web Speech API (Speech Recognition & Synthesis)
- LocalStorage API

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (starts with `AIza...`)

### 2. Run the Application

Simply open `index.html` in a modern web browser (Chrome, Edge, Firefox recommended).

No build process or server required — it's a pure client-side application.

### 3. Configure API Key

1. Click on "Settings" in the sidebar
2. Paste your Gemini API key
3. Click "Save"

## File Structure
CyberShieldAI/
├── index.html # Main HTML file
├── css/
│ └── style.css # All styles
├── js/
│ ├── app.js # Main application controller
│ ├── api.js # Gemini API communication
│ ├── speech.js # Voice recognition & synthesis
│ ├── ui.js # UI rendering
│ ├── storage.js # localStorage operations
│ ├── prompts.js # System prompts
│ ├── emergency.js # Emergency detection
│ ├── pdf.js # Report generation
│ ├── theme.js # Dark/light mode
│ ├── config.js # Configuration
│ └── utils.js # Helper functions
|
└── README.md # Documentation

text

## Usage

### Basic Chat

1. Type or speak your cybercrime situation
2. AI analyzes and provides structured response
3. Follow recommended actions
4. Download report or save to history

### Emergency Detection

The system automatically detects emergencies based on keywords like:
- "bank hacked", "money deducted", "UPI fraud"
- "OTP shared", "blackmail", "ransom"
- "account hacked", "identity theft"

When detected, an emergency banner appears with immediate action steps.

### Voice Commands

- Click the microphone button to speak
- Your speech is transcribed and sent automatically
- AI responses can be read aloud (toggle in settings)

## Important Notes

- **API Key Required**: You must provide your own Gemini API key
- **No Backend**: All data stays in your browser's localStorage
- **Disclaimer**: This tool provides guidance only, not legal advice
- **Internet Required**: For Gemini API calls and voice recognition

## Troubleshooting

### API Key Issues
- Ensure key starts with `AIza`
- Check you have quota remaining on Google Cloud
- Try regenerating the key

### Voice Recognition
- Requires HTTPS or localhost (for Chrome)
- Allow microphone permissions
- Use Chrome/Edge for best support

### Response Parsing Errors
- API may return malformed responses occasionally
- The app falls back to a safe response format

## Browser Support

- Chrome/Edge (latest) - Full support
- Firefox (latest) - Full support
- Safari (latest) - Partial (voice may have limitations)

## License

MIT License - Free for personal and commercial use.

## Disclaimer

CyberShield AI provides general guidance only. It is NOT a substitute for professional legal advice or official law enforcement action. Always contact 1930 or visit cybercrime.gov.in for official assistance. The AI may make errors — use responses as a starting point only.

## Credits

Built with:
- Google Gemini AI
- Web Speech API
- Fonts: Syne, Space Mono (Google Fonts)

---

**For emergencies, call 1930 (National Cyber Crime Helpline)**
Step 3 — Summary of Improvements
Category	Improvements Made
Architecture	Modular split into 13 focused files
Error Handling	API error fallback, validation, toast notifications
UI/UX	Smooth animations, mobile sidebar, better focus management
Accessibility	ARIA labels, keyboard navigation, reduced motion support
Performance	Debounced input, efficient DOM updates, event delegation
Features Added	Copy button, better voice handling, improved PDF reports
Code Quality	No inline handlers, consistent patterns, proper comments
The project is now fully modular, maintainable, and ready for deployment. Simply open index.html in a browser to use CyberShield AI!



