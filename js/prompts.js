/**
 * CyberShield AI — Prompts Module
 * Generates detailed system prompts for Gemini API
 */

const Prompts = {
  /**
   * Build comprehensive system prompt for Gemini
   * @returns {string} Detailed system prompt
   */
  buildSystemPrompt() {
    return `You are CyberShield AI, an advanced cybercrime assistance system for India.

Your role is to analyze cybercrime incidents and provide detailed, actionable guidance.

RESPONSE FORMAT (ALWAYS use this exact JSON structure):

{
  "crimeType": "Specific name of the cybercrime (e.g., 'Banking Fraud', 'Identity Theft', 'Social Media Hacking', 'Online Blackmail', 'UPI Fraud', 'Phishing Attack')",
  "confidence": 85,
  "severity": "High",
  "emergency": true,
  "explanation": "A detailed 5-8 sentence explanation of what happened, how the crime works, and why immediate action is needed. Write for an ordinary person. Use phrases like 'This appears to be' or 'This may involve' rather than absolute statements.",
  "immediateActions": [
    "Step 1: Detailed action with specific instructions",
    "Step 2: Include phone numbers or websites when relevant",
    "Step 3: Tell them what NOT to do as well",
    "Step 4: Explain consequences of delay",
    "Step 5: Include evidence preservation steps"
  ],
  "evidenceToCollect": [
    "Take screenshots of all suspicious messages/emails",
    "Save transaction IDs and bank statements",
    "Record dates and times of all communications",
    "Preserve URLs and profile names",
    "Document any money transferred, including amounts and recipient details"
  ],
  "supportOrgs": [
    "National Cyber Crime Helpline: Call 1930 (24x7)",
    "Cyber Crime Portal: https://cybercrime.gov.in",
    "Your bank's customer care number (find on official website or back of card)",
    "Local police station for filing FIR"
  ],
  "legalRefs": [
    "Information Technology Act, 2000 - Section 66C (Identity Theft)",
    "Information Technology Act, 2000 - Section 66D (Cheating by personation using computer resource)",
    "Indian Penal Code / Bharatiya Nyaya Sanhita - Relevant fraud sections"
  ],
  "preventiveMeasures": [
    "Enable Two-Factor Authentication (2FA) on all accounts",
    "Never share OTP, passwords, or PINs with anyone",
    "Verify website URLs before entering credentials",
    "Use different passwords for different accounts",
    "Regularly monitor bank statements and credit reports",
    "Keep your devices and software updated"
  ]
}

CRITICAL RULES:

1. CRIME TYPES - Use specific categories:
   - Banking/Financial Fraud
   - UPI/ Payment Fraud
   - Social Media Account Hacking
   - Identity Theft
   - Online Blackmail/ Sextortion
   - Phishing/ Credential Theft
   - Fake Profile/ Impersonation
   - Image Morphing/ AI-generated content misuse
   - Ransomware Attack
   - Investment/ Job Scam

2. SEVERITY LEVELS:
   - "Critical" - Immediate life safety or large financial loss (>₹50,000)
   - "High" - Active fraud, blackmail, or account takeover
   - "Medium" - Suspicious activity, potential fraud
   - "Low" - Information gathering, preventive advice

3. EMERGENCY STATUS:
   - true - For active financial fraud, blackmail, threats, or imminent harm
   - false - For general inquiries, preventive advice, or past incidents

4. CONFIDENCE SCORES:
   - 90-100%: Clear, unambiguous crime description
   - 70-89%: Strong indicators present
   - 50-69%: Possible crime, needs more information
   - Below 50%: Unclear, ask clarifying questions

5. EXPLANATION GUIDELINES:
   - Write 5-8 substantive sentences
   - Explain how the crime typically works
   - Describe immediate risks
   - Empower the victim with understanding
   - Use compassionate, non-judgmental language
   - NEVER blame the victim

6. IMMEDIATE ACTIONS:
   - Provide 5-7 specific, actionable steps
   - Include exact phone numbers (1930, bank helplines)
   - Prioritize steps by urgency
   - Include both DO and DO NOT instructions
   - Explain WHY each action is important

7. EVIDENCE COLLECTION:
   - List 4-6 specific evidence types
   - Explain how to collect each type
   - Emphasize NOT to delete anything until documented

8. NEVER:
   - Advise vigilantism or retaliation
   - Suggest hacking back
   - Blame the victim
   - Provide false hope
   - Make absolute legal claims (always use "may be considered under")

9. ALWAYS:
   - Include 1930 and cybercrime.gov.in
   - Be empathetic and supportive
   - Prioritize safety (physical and financial)
   - Encourage reporting to authorities
   - Suggest professional legal counsel for serious cases

Respond with ONLY valid JSON. No markdown. No code blocks. No extra text.`;
  },

  /**
   * Parse Gemini response with enhanced error handling
   * @param {string} rawResponse - Raw response from Gemini
   * @returns {Object} Parsed JSON object with all required fields
   */
  parseResponse(rawResponse) {
    try {
      let cleaned = rawResponse.trim();
      
      // Remove markdown code blocks
      cleaned = cleaned.replace(/^```json\s*/i, '');
      cleaned = cleaned.replace(/^```\s*/i, '');
      cleaned = cleaned.replace(/\s*```$/i, '');
      
      // Extract JSON object
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }
      
      const parsed = JSON.parse(cleaned);
      
      // Ensure all required fields exist with defaults
      return {
        crimeType: parsed.crimeType || 'Cybercrime Incident',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 70,
        severity: ['Critical', 'High', 'Medium', 'Low'].includes(parsed.severity) ? parsed.severity : 'Medium',
        emergency: parsed.emergency === true,
        explanation: parsed.explanation || 'Based on the information provided, this appears to be a cybercrime incident. Immediate action is recommended to protect yourself and preserve evidence.',
        immediateActions: Array.isArray(parsed.immediateActions) && parsed.immediateActions.length ? 
          parsed.immediateActions.slice(0, 8) : [
            'Call 1930 (National Cyber Crime Helpline) immediately',
            'Document everything with screenshots',
            'Change all passwords for affected accounts',
            'Contact your bank if financial information was shared',
            'File a complaint at cybercrime.gov.in'
          ],
        evidenceToCollect: Array.isArray(parsed.evidenceToCollect) && parsed.evidenceToCollect.length ?
          parsed.evidenceToCollect.slice(0, 6) : [
            'Screenshots of all relevant messages, emails, or transactions',
            'Dates, times, and usernames of all communications',
            'Transaction IDs and bank statement entries',
            'URLs of fake profiles or phishing websites'
          ],
        supportOrgs: Array.isArray(parsed.supportOrgs) && parsed.supportOrgs.length ?
          parsed.supportOrgs : [
            'National Cyber Crime Helpline: 1930',
            'Cyber Crime Portal: cybercrime.gov.in',
            'Your bank\'s 24x7 customer care'
          ],
        legalRefs: Array.isArray(parsed.legalRefs) && parsed.legalRefs.length ?
          parsed.legalRefs.slice(0, 3) : [
            'Information Technology Act, 2000',
            'Indian Penal Code / Bharatiya Nyaya Sanhita'
          ],
        preventiveMeasures: Array.isArray(parsed.preventiveMeasures) && parsed.preventiveMeasures.length ?
          parsed.preventiveMeasures.slice(0, 6) : [
            'Enable Two-Factor Authentication (2FA)',
            'Never share OTP or passwords',
            'Use strong, unique passwords for each account',
            'Regularly monitor account activity'
          ]
      };
      
    } catch (err) {
      console.error('Failed to parse Gemini response:', err);
      console.error('Raw response:', rawResponse);
      
      // Return enhanced fallback response
      return {
        crimeType: 'Cybercrime Incident - Requires Investigation',
        confidence: 50,
        severity: 'Medium',
        emergency: false,
        explanation: 'The AI analysis could not be fully completed. However, based on your description, this appears to be a potential cybercrime matter. Please follow the recommended actions below and contact official helplines for immediate assistance. Do not delay reporting to authorities as evidence may be lost.',
        immediateActions: [
          'Call 1930 (National Cyber Crime Helpline) for immediate guidance',
          'Do NOT delete any messages, emails, or transaction records',
          'Take screenshots of everything relevant',
          'Change passwords for potentially affected accounts',
          'File a formal complaint at cybercrime.gov.in',
          'Contact your bank if financial information was involved'
        ],
        evidenceToCollect: [
          'Screenshots of all suspicious communications',
          'Transaction IDs and bank statements',
          'Dates, times, and contact information',
          'URLs and profile names',
          'Email headers if available'
        ],
        supportOrgs: [
          'National Cyber Crime Helpline: 1930 (24x7)',
          'Cyber Crime Portal: https://cybercrime.gov.in',
          'Your bank\'s customer care (find on official website)',
          'Local police station for FIR registration'
        ],
        legalRefs: [
          'Information Technology Act, 2000 - various sections on cybercrimes',
          'Indian Penal Code / Bharatiya Nyaya Sanhita - fraud and cheating provisions',
          'Consult a legal professional for specific advice'
        ],
        preventiveMeasures: [
          'Enable Two-Factor Authentication (2FA) on all accounts',
          'Never share OTP, passwords, or personal information',
          'Verify website URLs before entering credentials',
          'Use a password manager for unique, strong passwords',
          'Regularly monitor bank and credit card statements',
          'Keep software and devices updated'
        ]
      };
    }
  },

  /**
   * Extract plain text for speech synthesis
   * @param {Object|string} response - Parsed response or raw JSON string
   * @returns {string} Plain text for TTS
   */
  extractPlainText(response) {
    let data;
    if (typeof response === 'string') {
      data = this.parseResponse(response);
    } else {
      data = response;
    }
    return `${data.crimeType}. ${data.explanation.substring(0, 300)} The most important immediate action is: ${data.immediateActions[0] || 'Call 1930'}. Remember to preserve all evidence.`;
  }
};

window.Prompts = Prompts;