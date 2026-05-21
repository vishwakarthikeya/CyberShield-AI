/**
 * CyberShield AI — PDF/Report Generator Module
 * Generates downloadable incident reports
 */

const PDFGenerator = {
  /**
   * Download incident report as HTML file
   * @param {string} userQuery - User's original query
   * @param {string} responseStr - JSON response string
   */
  downloadReport(userQuery, responseStr) {
    let data;
    try {
      data = JSON.parse(responseStr);
    } catch (err) {
      console.error('Failed to parse response for report:', err);
      data = {};
    }
    
    const now = new Date();
    const dateStr = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const html = this.generateReportHTML(userQuery, data, dateStr);
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybershield-report-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    Utils.showToast('Report downloaded successfully');
  },

  /**
   * Generate report HTML
   * @param {string} userQuery - User query
   * @param {Object} data - Response data
   * @param {string} dateStr - Formatted date string
   * @returns {string} HTML content
   */
  generateReportHTML(userQuery, data, dateStr) {
    const severityClass = data.severity === 'High' ? 'high' : 
                         data.severity === 'Medium' ? 'medium' : 'low';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CyberShield AI — Incident Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f7;
      color: #1a1a1e;
      line-height: 1.6;
    }
    
    @media print {
      body {
        background: white;
        margin: 0;
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
    
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #1a1a1e;
      margin-bottom: 30px;
    }
    
    .header h1 {
      font-size: 28px;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    
    .header .shield {
      font-size: 48px;
      margin-bottom: 10px;
    }
    
    .meta {
      font-size: 12px;
      color: #666;
      text-align: center;
      margin-bottom: 30px;
      padding: 10px;
      background: #e8e8ed;
      border-radius: 8px;
    }
    
    .section {
      margin-bottom: 24px;
      border-left: 3px solid #1a1a1e;
      padding-left: 16px;
    }
    
    .section-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .section-content {
      font-size: 15px;
    }
    
    .crime-type {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #1a1a1e;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 20px 0;
    }
    
    .metric-card {
      background: #e8e8ed;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    
    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .metric-value {
      font-size: 28px;
      font-weight: 800;
    }
    
    .metric-value.high { color: #dc2626; }
    .metric-value.medium { color: #f59e0b; }
    .metric-value.low { color: #10b981; }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .badge-high { background: #fee2e2; color: #dc2626; }
    .badge-medium { background: #fef3c7; color: #f59e0b; }
    .badge-low { background: #d1fae5; color: #10b981; }
    
    ul {
      list-style: none;
      padding-left: 0;
    }
    
    ul li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    
    ul li::before {
      content: '•';
      position: absolute;
      left: 4px;
      color: #1a1a1e;
      font-weight: bold;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 11px;
      color: #999;
      text-align: center;
    }
    
    .helpline {
      background: #fee2e2;
      padding: 16px;
      border-radius: 12px;
      margin: 20px 0;
      text-align: center;
    }
    
    .helpline a {
      color: #dc2626;
      text-decoration: none;
      font-weight: bold;
    }
    
    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr;
      }
      body {
        margin: 20px;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="shield">🛡️</div>
    <h1>CyberShield AI — Incident Report</h1>
  </div>
  
  <div class="meta">
    Generated: ${Utils.escapeHtml(dateStr)}<br>
    India Cyber Crime Helpline: <strong>1930</strong> | cybercrime.gov.in
  </div>
  
  <div class="crime-type">
    ${Utils.escapeHtml(data.crimeType || 'Cybercrime Incident')}
  </div>
  
  <div class="grid">
    <div class="metric-card">
      <div class="metric-label">Confidence</div>
      <div class="metric-value">${data.confidence || 0}%</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Severity</div>
      <div class="metric-value ${severityClass}">${Utils.escapeHtml(data.severity || 'Medium')}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Emergency</div>
      <div class="metric-value" style="color:${data.emergency ? '#dc2626' : '#10b981'}">${data.emergency ? '⚠ YES' : 'NO'}</div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Reported Incident</div>
    <div class="section-content">${Utils.escapeHtml(userQuery)}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Explanation</div>
    <div class="section-content">${Utils.escapeHtml(data.explanation || '')}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Immediate Actions</div>
    <ul>
      ${(data.immediateActions || []).map(a => `<li>${Utils.escapeHtml(a)}</li>`).join('')}
    </ul>
  </div>
  
  <div class="section">
    <div class="section-title">Support Organizations</div>
    <ul>
      ${(data.supportOrgs || []).map(o => `<li>${Utils.escapeHtml(o)}</li>`).join('')}
    </ul>
  </div>
  
  <div class="section">
    <div class="section-title">Possible Legal References</div>
    <ul>
      ${(data.legalRefs || []).map(l => `<li>${Utils.escapeHtml(l)}</li>`).join('')}
    </ul>
  </div>
  
  <div class="section">
    <div class="section-title">Preventive Measures</div>
    <ul>
      ${(data.preventiveMeasures || []).map(p => `<li>${Utils.escapeHtml(p)}</li>`).join('')}
    </ul>
  </div>
  
  <div class="helpline">
    <strong>🚨 Need immediate help?</strong><br>
    Call <a href="tel:1930">1930</a> (National Cyber Crime Helpline)<br>
    or visit <a href="https://cybercrime.gov.in" target="_blank">cybercrime.gov.in</a>
  </div>
  
  <div class="footer">
    <strong>DISCLAIMER:</strong> This report is generated by CyberShield AI and is for guidance purposes only.<br>
    It is NOT a substitute for professional legal advice or official law enforcement action.<br>
    Always contact 1930 or visit cybercrime.gov.in for official assistance.
  </div>
  
  <div class="no-print" style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #1a1a1e; color: white; border: none; border-radius: 8px; cursor: pointer;">Print / Save as PDF</button>
  </div>
</body>
</html>`;
  }
};

window.PDFGenerator = PDFGenerator;