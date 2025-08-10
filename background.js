// --- On Install/Update ---
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings on installation
  chrome.storage.sync.set({
    aiSettings: {
      style: 'formal',
      tone: 'neutral',
      length: 'medium',
      apiKey: '' // Placeholder for API key
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

// --- Placeholder AI Logic ---
async function getAIResponse(action, text) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real extension, this would be a fetch call to an AI API
  // using the user's API key from chrome.storage.sync.

  const originalText = text ? `"${text.substring(0, 50)}..."` : 'the user\'s text';

  switch (action) {
    case 'rewrite':
      return `This is a "pre-humanized," rewritten version of ${originalText}. It has varied sentence length and a natural, academic tone.`;
    case 'expand':
      return `Here is an expanded version of ${originalText}. It elaborates on the key points, adding more detail and context to make the argument more robust and comprehensive.`;
    case 'shorten':
      return `This is a shortened, concise version of ${originalText}.`;
    case 'improve-clarity':
      return `The original text, ${originalText}, has been rephrased for better clarity and impact.`;
    default:
      return 'Unknown action. No suggestion available.';
  }
}

console.log('AI Writing Assistant background service worker started.');
