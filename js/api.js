/**
 * CyberShield AI — API Module
 * Handles communication with Google Gemini API with retry logic
 */

const API = {
  possibleModels: CONFIG.GEMINI_ALTERNATIVES,
  workingModel: null,
  maxRetries: 2,
  
  /**
   * Call Gemini API with user message
   * @param {string} userMessage - User's input message
   * @param {string} apiKey - Gemini API key
   * @returns {Promise<Object>} Parsed response
   */
  async callGemini(userMessage, apiKey) {
    // First, check for special scenarios locally
    const scenario = Scenarios.detectScenario(userMessage);
    
    if (this.workingModel) {
      return this.makeRequestWithRetry(this.workingModel, userMessage, apiKey);
    }
    
    return this.tryModelWithRetry(0, userMessage, apiKey);
  },
  
  /**
   * Try models with retry logic
   */
  async tryModelWithRetry(index, userMessage, apiKey, retryCount = 0) {
    if (index >= this.possibleModels.length) {
      throw new Error('No working models found. Please check your API key and enable the Generative Language API.');
    }
    
    const model = this.possibleModels[index];
    
    try {
      console.log(`Trying model: ${model} (attempt ${retryCount + 1})`);
      const response = await this.makeRequest(model, userMessage, apiKey);
      
      this.workingModel = model;
      console.log(`✅ Successfully using model: ${model}`);
      return response;
      
    } catch (error) {
      console.log(`Model ${model} failed:`, error.message);
      
      if (retryCount < this.maxRetries) {
        console.log(`Retrying ${model} (attempt ${retryCount + 2})...`);
        await this.delay(1000);
        return this.tryModelWithRetry(index, userMessage, apiKey, retryCount + 1);
      }
      
      return this.tryModelWithRetry(index + 1, userMessage, apiKey, 0);
    }
  },
  
  /**
   * Make request with retry logic
   */
  async makeRequestWithRetry(model, userMessage, apiKey, retryCount = 0) {
    try {
      return await this.makeRequest(model, userMessage, apiKey);
    } catch (error) {
      if (retryCount < this.maxRetries) {
        console.log(`Retrying ${model}...`);
        await this.delay(1000);
        return this.makeRequestWithRetry(model, userMessage, apiKey, retryCount + 1);
      }
      throw error;
    }
  },
  
  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * Make a request to the Gemini API
   */
  async makeRequest(model, userMessage, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const systemPrompt = Prompts.buildSystemPrompt();
    
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUser's cybercrime incident to analyze: "${userMessage}"\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no code blocks, no extra text. Just the JSON object.`
            }
          ]
        }
      ],
      generationConfig: CONFIG.GENERATION_CONFIG,
      safetySettings: CONFIG.SAFETY_SETTINGS
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      let errorMessage = responseData?.error?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const generatedText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('Empty response from Gemini API');
    }
    
    console.log('API Response received, parsing...');
    let parsedResponse = Prompts.parseResponse(generatedText);
    
    // Enhance with scenario detection
    parsedResponse = Scenarios.enhanceWithScenario(parsedResponse, userMessage);
    
    return parsedResponse;
  },
  
  /**
   * Get available models for this API key
   */
  async getAvailableModels(apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        return data.models?.map(m => m.name.split('/').pop()) || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  },
  
  /**
   * Test API key validity
   */
  async testApiKey(apiKey) {
    try {
      const models = await this.getAvailableModels(apiKey);
      
      if (models.length > 0) {
        const hasCompatibleModel = models.some(m => 
          m.includes('2.0-flash') || m.includes('2.5-flash') || m.includes('flash-latest') || m.includes('pro')
        );
        
        if (hasCompatibleModel) {
          return { 
            valid: true, 
            message: `✅ API key is valid! Found ${models.length} models. Ready to chat!`,
            models: models.slice(0, 5)
          };
        } else {
          return { 
            valid: true, 
            message: `⚠️ API key valid but may need model update. Found ${models.length} models.`,
            models: models.slice(0, 5)
          };
        }
      }
      
      return { valid: false, message: 'No models found for this API key. Please enable the Generative Language API.' };
      
    } catch (error) {
      return { valid: false, message: `Connection error: ${error.message}` };
    }
  }
};

window.API = API;