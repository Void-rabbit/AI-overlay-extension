document.addEventListener('DOMContentLoaded', () => {
  const optionsBtn = document.getElementById('options-btn');
  if (optionsBtn) {
    optionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }
});
