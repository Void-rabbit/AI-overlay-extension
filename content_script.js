(() => {
  console.log("AI Writing Assistant content script loaded.");

  let activeElement = null;

  // --- UI Creation ---
  function createAssistantUI() {
    const container = document.createElement('div');
    container.id = 'ai-assistant-container';
    container.style.display = 'none'; // Initially hidden

    const header = document.createElement('div');
    header.id = 'ai-assistant-header';

    const title = document.createElement('h3');
    title.textContent = 'AI Writing Assistant';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'ai-assistant-close-btn';
    closeBtn.innerHTML = '&times;';

    header.appendChild(title);
    header.appendChild(closeBtn);

    const toolbar = document.createElement('div');
    toolbar.id = 'ai-assistant-toolbar';
    const actions = ['Rewrite', 'Expand', 'Shorten', 'Improve Clarity'];
    actions.forEach(action => {
      const button = document.createElement('button');
      button.textContent = action;
      button.dataset.action = action.toLowerCase().replace(' ', '-');
      toolbar.appendChild(button);
    });

    const content = document.createElement('div');
    content.id = 'ai-assistant-content';

    const textarea = document.createElement('textarea');
    textarea.id = 'ai-assistant-textarea';
    textarea.placeholder = 'AI suggestions will appear here...';

    const insertBtn = document.createElement('button');
    insertBtn.id = 'ai-assistant-insert-btn';
    insertBtn.textContent = 'Insert';

    content.appendChild(textarea);
    content.appendChild(insertBtn);

    const resizer = document.createElement('div');
    resizer.className = 'resizer bottom-right';

    container.appendChild(header);
    container.appendChild(toolbar);
    container.appendChild(content);
    container.appendChild(resizer);

    document.body.appendChild(container);

    // --- Floating Toggle Button ---
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'ai-assistant-toggle-btn';
    toggleBtn.textContent = '✨';
    document.body.appendChild(toggleBtn);

    // --- Event Listeners ---
    toggleBtn.addEventListener('click', () => {
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    });

    closeBtn.addEventListener('click', () => {
      container.style.display = 'none';
    });

    makeDraggable(container, header);
    makeResizable(container, resizer);

    // --- Action Listeners ---
    insertBtn.addEventListener('click', insertText);
    toolbar.addEventListener('click', handleToolbarAction);
  }

  // --- Core Functionality ---

  function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function makeResizable(element, resizer) {
      resizer.onmousedown = function(e) {
          e.preventDefault();
          let startX = e.clientX;
          let startY = e.clientY;
          let startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
          let startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

          document.onmousemove = function(e) {
              element.style.width = (startWidth + e.clientX - startX) + 'px';
              element.style.height = (startHeight + e.clientY - startY) + 'px';
          };

          document.onmouseup = function() {
              document.onmousemove = null;
              document.onmouseup = null;
          };
      };
  }

  function insertText() {
    const textToInsert = document.getElementById('ai-assistant-textarea').value;
    if (activeElement && textToInsert) {
      if (typeof activeElement.value !== 'undefined') {
        // For <textarea> and <input>
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const text = activeElement.value;
        activeElement.value = text.slice(0, start) + textToInsert + text.slice(end);
        activeElement.selectionStart = activeElement.selectionEnd = start + textToInsert.length;
      } else if (activeElement.isContentEditable) {
        // For contenteditable elements
        activeElement.focus();
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(textToInsert));
        }
      }
      activeElement.focus();
    }
  }

  function handleToolbarAction(e) {
      if (e.target.tagName === 'BUTTON') {
          const action = e.target.dataset.action;
          const currentText = activeElement ? (activeElement.value || activeElement.textContent) : '';
          console.log(`Toolbar action: ${action}, Current text: ${currentText.substring(0, 100)}...`);
          // Placeholder for sending to background script
          chrome.runtime.sendMessage({
              type: 'ai-action',
              action: action,
              text: currentText
          }, (response) => {
              if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError.message);
                  return;
              }
              const assistantTextarea = document.getElementById('ai-assistant-textarea');
              assistantTextarea.value = response.text;
          });
      }
  }

  // --- Event Listeners for editable fields ---
  document.addEventListener('focusin', (e) => {
    if (e.target.matches('textarea, input[type="text"], [contenteditable="true"]')) {
      activeElement = e.target;
      console.log('Editable element focused:', activeElement);
      // Maybe show the toggle button or panel automatically
      const toggleBtn = document.getElementById('ai-assistant-toggle-btn');
      if(toggleBtn) toggleBtn.style.display = 'flex';
    }
  });

  // --- Message Listener from Background ---
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'toggle-assistant-ui') {
      const container = document.getElementById('ai-assistant-container');
      if (container) {
        const isVisible = container.style.display === 'flex';
        container.style.display = isVisible ? 'none' : 'flex';
      }
    }
  });

  // --- Initial UI Load ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAssistantUI);
  } else {
    createAssistantUI();
  }

})();
