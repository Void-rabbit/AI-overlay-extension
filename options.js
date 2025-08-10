// Saves options to chrome.storage
function save_options() {
  const style = document.getElementById('ai-style').value;
  const tone = document.getElementById('tone-warmth').value;
  const length = document.getElementById('output-length').value;

  chrome.storage.sync.set({
    aiSettings: {
      style: style,
      tone: tone,
      length: length
    }
  }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    aiSettings: {
      style: 'formal',
      tone: 'neutral',
      length: 'medium'
    }
  }, (items) => {
    document.getElementById('ai-style').value = items.aiSettings.style;
    document.getElementById('tone-warmth').value = items.aiSettings.tone;
    document.getElementById('output-length').value = items.aiSettings.length;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    save_options();
});
