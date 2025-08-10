// --- On Install/Update ---
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings on installation
  chrome.storage.sync.set({
    aiSettings: {
      style: 'formal',
      tone: 'neutral',
      length: 'medium'
    }
  });
  console.log('AI Writing Assistant installed and default settings saved.');
});

// --- Command Listener for Keyboard Shortcuts ---
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-assistant') {
    // Send a message to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle-assistant-ui' });
      }
    });
  }
});

// --- Message Listener ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ai-action') {
    console.log('Received AI action request:', request);
    // Simulate async API call
    getAIResponse(request.action, request.text).then(response => {
      sendResponse({ text: response });
    });
    return true; // Indicates that the response is sent asynchronously
  }
});

// --- AI API Configuration ---
// WARNING: This key is embedded directly in the extension code.
// This is a major security risk. Anyone who downloads the extension can find and use this key.
// Proceeding as per user's explicit instruction and acceptance of risk.
const GEMINI_API_KEY = 'AIzaSyA53gKJzOjH7pRy2CtIZ3XUZ6eafFs5k1k';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function getPromptForAction(action, text) {
    const baseInstruction = "You are an expert academic writing assistant. Your responses should be 'pre-humanized' - meaning they have varied sentence length, natural transitions, and a human-like tone, avoiding robotic or overly formal language. Respond only with the generated text, without any conversational preamble.";

    switch (action) {
        case 'rewrite':
            return `${baseInstruction}\n\nRewrite the following text:\n\n---\n${text}\n---`;
        case 'expand':
            return `${baseInstruction}\n\nExpand upon the following text, adding more detail and context:\n\n---\n${text}\n---`;
        case 'shorten':
            return `${baseInstruction}\n\nShorten the following text, making it more concise and to the point:\n\n---\n${text}\n---`;
        case 'improve-clarity':
            return `${baseInstruction}\n\nImprove the clarity of the following text, rephrasing for better impact and readability:\n\n---\n${text}\n---`;
        default:
            return text;
    }
}

async function getAIResponse(action, text) {
  if (!text) {
    return "Please provide some text to work with.";
  }

  const prompt = getPromptForAction(action, text);

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "contents": [
          { "parts": [{ "text": prompt }] }
        ]
      })
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Gemini API Error:', errorBody);
      return `Error: ${response.status} ${response.statusText}. See background console for details.`;
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      // This can happen if the content is blocked due to safety settings
      console.error('API response missing candidates:', data);
      return "The AI model did not return a response. This may be due to the safety settings or an invalid prompt.";
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `An error occurred while contacting the AI. Check the background console for details.`;
  }
}

console.log('AI Writing Assistant background service worker started.');
