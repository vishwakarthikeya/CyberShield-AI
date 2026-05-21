/**
 * CyberShield AI — Special Scenarios Module
 * Handles pre-processing and detection of specific cybercrime scenarios
 */

const Scenarios = {
  /**
   * Detect scenario type from user message
   * @param {string} message - User message
   * @returns {Object|null} Scenario object or null
   */
  detectScenario(message) {
    const lowerMsg = message.toLowerCase();
    
    // Define scenarios with keywords and responses
    const scenarios = [
      {
        type: 'Banking Fraud',
        keywords: ['bank account', 'banking', 'bank transaction', 'unauthorized transaction', 'money missing from account', 'bank deducted', 'bank fraud'],
        priority: 'Critical',
        emergency: true,
        customActions: [
          'IMMEDIATELY call your bank\'s 24x7 helpline number (found on the back of your debit/credit card or bank statement)',
          'Request them to freeze your account/card immediately',
          'Ask for transaction dispute and reversal',
          'Note down the complaint reference number',
          'Call 1930 (National Cyber Crime Helpline) to register a cyber complaint',
          'File an online complaint at cybercrime.gov.in',
          'Visit your home branch with ID proof to file written complaint'
        ]
      },
      {
        type: 'UPI Fraud',
        keywords: ['upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'tez', 'bhim', 'upi pin', 'upi transaction'],
        priority: 'Critical',
        emergency: true,
        customActions: [
          'IMMEDIATELY call your bank\'s UPI helpline',
          'Disable UPI through your banking app if possible',
          'Check all recent UPI transactions in your app',
          'Call 1930 immediately - UPI fraud is time-sensitive',
          'File a complaint at cybercrime.gov.in with transaction details',
          'Contact your bank to dispute the transaction',
          'Change your UPI PIN immediately'
        ]
      },
      {
        type: 'OTP Scam',
        keywords: ['otp', 'one time password', 'shared otp', 'gave otp', 'sent otp', 'otp leaked'],
        priority: 'Critical',
        emergency: true,
        customActions: [
          'IMMEDIATELY call your bank - OTP compromise is a major security breach',
          'Request to block all cards and accounts immediately',
          'Check for any unauthorized transactions in the last few minutes',
          'Change ALL passwords (banking, email, social media)',
          'Call 1930 to report the OTP fraud',
          'File complaint at cybercrime.gov.in',
          'If you use UPI, disable and re-enable with new PIN'
        ]
      },
      {
        type: 'Account Hacking',
        keywords: ['hacked', 'hacker', 'account hacked', 'compromised', 'someone logged in', 'unauthorized access', 'password changed'],
        priority: 'High',
        emergency: true,
        customActions: [
          'Try to regain access using "Forgot Password" immediately',
          'Change password to a strong, unique password',
          'Enable Two-Factor Authentication (2FA) right away',
          'Check account settings for any added recovery emails/phones',
          'Log out of all devices (most platforms have this option)',
          'Review recent activity for unauthorized actions',
          'Report the hacking to the platform\'s support team',
          'If financial accounts, call your bank immediately'
        ]
      },
      {
        type: 'Fake Profile / Impersonation',
        keywords: ['fake profile', 'impersonation', 'fake account', 'pretending to be me', 'clone account', 'duplicate profile'],
        priority: 'High',
        emergency: true,
        customActions: [
          'Take screenshots of the fake profile (posts, bio, followers)',
          'Report the profile to the platform immediately',
          'Alert your friends and family to block and report',
          'Save URLs of the fake profile',
          'If they are messaging your contacts, warn everyone',
          'File complaint at cybercrime.gov.in',
          'Consider posting a clarification on your real account'
        ]
      },
      {
        type: 'Image Morphing / AI Misuse',
        keywords: ['morphed', 'morphing', 'fake photo', 'edited my photo', 'ai generated', 'deepfake', 'fake image', 'morphed my picture'],
        priority: 'Critical',
        emergency: true,
        customActions: [
          'DO NOT panic - engaging may make it worse',
          'DO NOT share the morphed image further',
          'Take screenshots of where the image is posted',
          'Report the content to the platform immediately',
          'Save evidence without viewing more than necessary',
          'Call 1930 - image morphing is a serious cybercrime',
          'File complaint at cybercrime.gov.in under "Image/Video Morphing"',
          'Consider legal consultation for defamation'
        ]
      },
      {
        type: 'Online Blackmail / Sextortion',
        keywords: ['blackmail', 'blackmailed', 'extortion', 'sextortion', 'threatening to share', 'private photos', 'nude photos', 'explicit photos', 'pay or share'],
        priority: 'Critical',
        emergency: true,
        customActions: [
          'DO NOT PAY - paying makes it worse (they will demand more)',
          'DO NOT engage further with the blackmailer',
          'DO NOT delete anything - preserve all evidence',
          'Take screenshots of all communications',
          'Save their usernames, phone numbers, email addresses',
          'Block the blackmailer but screenshot BEFORE blocking',
          'Call 1930 IMMEDIATELY - this is a serious crime',
          'File an anonymous complaint at cybercrime.gov.in if concerned about identity',
          'Talk to a trusted person - you are NOT alone',
          'Remember: the shame belongs to the criminal, not you'
        ]
      },
      {
        type: 'Phishing Attack',
        keywords: ['phishing', 'fake email', 'fake link', 'suspicious link', 'clicked a link', 'fake website', 'fraudulent message', 'scam message'],
        priority: 'High',
        emergency: false,
        customActions: [
          'If you entered any credentials, change those passwords immediately',
          'If you entered banking details, call your bank right away',
          'Do NOT click the link again',
          'Forward the phishing email to report@phishing.gov.in',
          'Report the message to the platform (e.g., Gmail "Report phishing")',
          'Scan your device for malware if you downloaded anything',
          'Enable 2FA on accounts that support it'
        ]
      },
      {
        type: 'Ransomware Attack',
        keywords: ['ransomware', 'virus locked my files', 'encrypted my files', 'pay to unlock', 'ransom demand', 'files encrypted'],
        priority: 'Critical',
        emergency: true,
        customActions: [
          'DO NOT pay the ransom - there is no guarantee you will get files back',
          'Disconnect your computer from the internet IMMEDIATELY',
          'Do not restart or shut down (this may destroy evidence)',
          'Take photos of the ransom screen',
          'Do not try to decrypt or use recovery software (may make it worse)',
          'Call 1930 and report ransomware attack',
          'Contact a cybersecurity professional',
          'If you have backups, DO NOT connect them yet'
        ]
      }
    ];
    
    for (const scenario of scenarios) {
      if (Utils.containsAny(lowerMsg, scenario.keywords)) {
        return scenario;
      }
    }
    
    return null;
  },
  
  /**
   * Enhance response with scenario-specific information
   * @param {Object} response - Original parsed response
   * @param {string} userMessage - User's message
   * @returns {Object} Enhanced response
   */
  enhanceWithScenario(response, userMessage) {
    const scenario = this.detectScenario(userMessage);
    if (!scenario) return response;
    
    // Enhance severity if scenario priority is higher
    const priorityMap = { 'Critical': 'Critical', 'High': 'High' };
    if (scenario.priority === 'Critical' && response.severity !== 'Critical') {
      response.severity = 'Critical';
      response.emergency = true;
    } else if (scenario.priority === 'High' && response.severity === 'Medium') {
      response.severity = 'High';
      response.emergency = true;
    }
    
    // Add scenario-specific actions at the beginning of immediateActions
    if (scenario.customActions && scenario.customActions.length) {
      const existingActions = response.immediateActions || [];
      response.immediateActions = [...scenario.customActions, ...existingActions];
      // Limit to 8 actions total
      response.immediateActions = response.immediateActions.slice(0, 8);
    }
    
    // Update crime type if more specific
    if (scenario.type && (!response.crimeType || response.crimeType === 'Cybercrime Incident')) {
      response.crimeType = scenario.type;
      response.confidence = Math.min(response.confidence + 10, 95);
    }
    
    return response;
  }
};

window.Scenarios = Scenarios;