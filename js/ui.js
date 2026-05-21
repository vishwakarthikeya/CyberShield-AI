/**
 * CyberShield AI — UI Module
 * Handles all DOM manipulation and UI rendering
 */

const UI = {
  currentTypingId: null,
  emergencyBannerShown: false,

  init() {
    this.renderSuggestions();
    this.renderFeatures();
  },

  renderSuggestions() {
    const container = document.getElementById('suggestion-chips');
    if (!container) return;
    
    container.innerHTML = CONFIG.SUGGESTIONS.map(suggestion => 
      `<div class="chip" data-suggestion="${Utils.escapeForAttr(suggestion)}">${Utils.sanitize(suggestion)}</div>`
    ).join('');
    
    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('user-input');
        if (input) {
          input.value = chip.textContent;
          input.focus();
          Utils.autoResizeTextarea(input);
        }
      });
    });
  },

  renderFeatures() {
    const container = document.getElementById('feature-grid');
    if (!container) return;
    
    container.innerHTML = CONFIG.FEATURES.map(feature => `
      <div class="feature-pill">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="${feature.icon}"/>
        </svg>
        ${Utils.sanitize(feature.name)}
      </div>
    `).join('');
  },

  addUserMessage(text, timestamp) {
    const messagesContainer = document.getElementById('chat-messages');
    const timeStr = Utils.formatTime(timestamp);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'msg user';
    messageDiv.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div class="msg-bubble">
        <div>${Utils.sanitize(text)}</div>
        <div class="msg-time">${timeStr}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    const welcomeCard = document.getElementById('welcome-card');
    if (welcomeCard) welcomeCard.remove();
  },

  addTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const id = 'typing-' + Utils.generateId();
    
    const indicatorDiv = document.createElement('div');
    indicatorDiv.id = id;
    indicatorDiv.className = 'msg bot';
    indicatorDiv.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">🛡️</div>
      <div class="msg-bubble">
        <div class="typing-indicator">
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="typing-label">CyberShield AI is analyzing your situation...</span>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(indicatorDiv);
    this.scrollToBottom();
    
    this.currentTypingId = id;
    return id;
  },

  removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) indicator.remove();
    if (this.currentTypingId === id) this.currentTypingId = null;
  },

  addBotResponse(data, userQuery, timestamp) {
    const messagesContainer = document.getElementById('chat-messages');
    const timeStr = Utils.formatTime(timestamp);
    
    const severityClass = data.severity === 'Critical' ? 'badge-red' :
                         data.severity === 'High' ? 'badge-red' : 
                         data.severity === 'Medium' ? 'badge-amber' : 'badge-green';
    
    const emergencyBadge = data.emergency ? '<span class="badge badge-red">🚨 EMERGENCY — ACT IMMEDIATELY</span>' : '';
    const confidenceColor = data.confidence >= 80 ? 'var(--green)' : 
                           data.confidence >= 60 ? 'var(--amber)' : 'var(--red)';
    
    const responseId = 'resp-' + Utils.generateId();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'msg bot';
    messageDiv.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">🛡️</div>
      <div class="msg-bubble">
        <div class="response-card" id="${responseId}">
          <div class="response-header">
            <div class="response-header-left">
              <span class="badge ${severityClass}">${Utils.sanitize(data.severity || 'Medium')} SEVERITY</span>
              ${emergencyBadge}
            </div>
            <span class="msg-time">${timeStr}</span>
          </div>
          <div class="response-body">
            <div class="resp-section">
              <div class="resp-label">Cybercrime Type</div>
              <div class="resp-value" style="font-size:18px;font-weight:800;">${Utils.sanitize(data.crimeType || 'Unknown')}</div>
            </div>
            <div class="resp-grid">
              <div class="resp-metric">
                <div class="resp-label">Confidence</div>
                <div class="resp-metric-val" style="color:${confidenceColor};">${data.confidence || 0}%</div>
              </div>
              <div class="resp-metric">
                <div class="resp-label">Severity</div>
                <div class="resp-metric-val">${Utils.sanitize(data.severity || 'N/A')}</div>
              </div>
              <div class="resp-metric">
                <div class="resp-label">Emergency</div>
                <div class="resp-metric-val" style="color:${data.emergency ? 'var(--red)' : 'var(--green)'};">${data.emergency ? '⚠ YES - ACT NOW' : 'NO'}</div>
              </div>
            </div>
            <div class="resp-divider"></div>
            <div class="resp-section">
              <div class="resp-label">📋 Detailed Explanation</div>
              <div class="resp-value" style="line-height:1.7;">${Utils.sanitize(data.explanation || '')}</div>
            </div>
            <div class="resp-divider"></div>
            <div class="resp-section">
              <div class="resp-label">⚡ IMMEDIATE ACTIONS (Do these NOW)</div>
              <ul class="resp-list">${(data.immediateActions || []).map(a => `<li><strong>→</strong> ${Utils.sanitize(a)}</li>`).join('')}</ul>
            </div>
            <div class="resp-divider"></div>
            <div class="resp-section">
              <div class="resp-label">📸 EVIDENCE TO COLLECT (Don't delete anything)</div>
              <ul class="resp-list">${(data.evidenceToCollect || []).map(e => `<li><strong>•</strong> ${Utils.sanitize(e)}</li>`).join('')}</ul>
            </div>
            <div class="resp-divider"></div>
            <div class="resp-section">
              <div class="resp-label">🛡️ Support Organizations</div>
              <ul class="resp-list">${(data.supportOrgs || []).map(o => `<li><strong>📞</strong> ${Utils.sanitize(o)}</li>`).join('')}</ul>
            </div>
            <div class="resp-section">
              <div class="resp-label">⚖️ Possible Legal References</div>
              <ul class="resp-list">${(data.legalRefs || []).map(l => `<li><strong>📜</strong> ${Utils.sanitize(l)}</li>`).join('')}</ul>
            </div>
            <div class="resp-divider"></div>
            <div class="resp-section">
              <div class="resp-label">🛡️ Preventive Measures (For future safety)</div>
              <ul class="resp-list">${(data.preventiveMeasures || []).map(p => `<li><strong>✓</strong> ${Utils.sanitize(p)}</li>`).join('')}</ul>
            </div>
            <div class="resp-divider"></div>
            <div class="resp-section">
              <div class="resp-label">🚨 Cyber Helpline (24x7)</div>
              <div class="helpline-row">
                <a href="tel:1930" class="helpline-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/></svg>
                  Call 1930 NOW
                </a>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="helpline-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  File Online Complaint
                </a>
              </div>
            </div>
          </div>
          <div class="response-footer">
            <button class="speak-btn" data-text="${Utils.escapeForAttr(data.explanation || '')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
              Read Aloud
            </button>
            <button class="copy-btn" data-text="${Utils.escapeForAttr(JSON.stringify(data, null, 2))}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              Copy Response
            </button>
            <button class="dl-btn" data-query="${Utils.escapeForAttr(userQuery)}" data-response="${Utils.escapeForAttr(JSON.stringify(data))}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Report
            </button>
          </div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    // Attach event listeners
    const speakBtn = messageDiv.querySelector('.speak-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        const text = speakBtn.getAttribute('data-text');
        if (text) Speech.speak(text);
      });
    }
    
    const copyBtn = messageDiv.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const text = copyBtn.getAttribute('data-text');
        if (text) {
          const success = await Utils.copyToClipboard(text);
          Utils.showToast(success ? 'Response copied to clipboard' : 'Failed to copy');
        }
      });
    }
    
    const dlBtn = messageDiv.querySelector('.dl-btn');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        const query = dlBtn.getAttribute('data-query');
        const responseStr = dlBtn.getAttribute('data-response');
        if (query && responseStr) {
          PDFGenerator.downloadReport(query, responseStr);
        }
      });
    }
  },

  addEmergencyBanner() {
    if (this.emergencyBannerShown) return;
    
    const messagesContainer = document.getElementById('chat-messages');
    const bannerDiv = document.createElement('div');
    bannerDiv.innerHTML = Emergency.getBannerHTML();
    
    messagesContainer.appendChild(bannerDiv.firstElementChild);
    this.scrollToBottom();
    this.emergencyBannerShown = true;
  },

  addErrorMessage(errorText) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'msg bot';
    messageDiv.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">🛡️</div>
      <div class="msg-bubble">
        <div class="response-card">
          <div class="response-header">
            <span class="badge badge-red">ERROR</span>
          </div>
          <div class="response-body">
            <div class="resp-value" style="color:var(--red);font-size:14px;">⚠ ${Utils.sanitize(errorText)}</div>
            <div class="resp-value" style="font-size:13px;color:var(--text-secondary);margin-top:12px;">
              <strong>Troubleshooting steps:</strong><br/>
              1. Check that your API key is valid in Settings<br/>
              2. Ensure the Generative Language API is enabled in Google Cloud Console<br/>
              3. Check that billing is set up (free tier available)<br/>
              4. Try refreshing the page and re-entering your API key<br/>
              5. If the problem persists, try creating a new API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--blue);">Google AI Studio</a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  },

  clearChat() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = `
      <div class="welcome-card" id="welcome-card">
        <div class="welcome-shield" aria-hidden="true">🛡️</div>
        <h1 class="welcome-title">CyberShield AI</h1>
        <p class="welcome-sub">Advanced AI-powered cybercrime assistance.<br/>Describe your situation — we'll provide detailed analysis and actionable steps.</p>
        <div class="suggestion-chips" id="suggestion-chips"></div>
      </div>
    `;
    
    this.renderSuggestions();
    this.emergencyBannerShown = false;
    Utils.showToast('Chat cleared');
  },

  scrollToBottom() {
    const container = document.getElementById('chat-messages');
    Utils.scrollToBottom(container);
  },

  renderHistoryPanel(history) {
    const container = document.getElementById('history-list');
    if (!container) return;
    
    const userMessages = history.filter(m => m.role === 'user');
    
    if (userMessages.length === 0) {
      container.innerHTML = '<div class="empty-state">No history yet.<br/>Start a conversation on the Home tab.</div>';
      return;
    }
    
    const reversedMessages = [...userMessages].reverse();
    
    container.innerHTML = reversedMessages.slice(0, CONFIG.MAX_HISTORY_ITEMS).map(msg => {
      const date = new Date(msg.timestamp);
      return `
        <div class="history-item" data-message="${Utils.escapeForAttr(msg.content)}">
          <div class="history-q">${Utils.sanitize(msg.content.length > 80 ? msg.content.substring(0, 80) + '...' : msg.content)}</div>
          <div class="history-meta">${Utils.formatDateTime(date)}</div>
        </div>
      `;
    }).join('');
    
    container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const message = item.getAttribute('data-message');
        if (message && window.CyberShield) {
          window.CyberShield.fillFromHistory(message);
        }
      });
    });
  }
};

window.UI = UI;