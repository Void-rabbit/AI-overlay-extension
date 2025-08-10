# AI Writing Assistant Chrome Extension

This is a Manifest V3 Chrome Extension that acts as a real-time AI writing assistant. It provides a floating UI on any web page to help users write, rewrite, and improve their text.

**Note:** This extension currently functions as a **panel-based assistant**. You can open the panel to generate and insert text. Real-time, inline suggestions (like autocompletion as you type) are a potential feature for a future version.

## Features

*   Floating UI that is draggable and resizable.
*   Injects into any editable text field on any website.
*   Toolbar with actions: "Rewrite," "Expand," "Shorten," and "Improve Clarity."
*   Works across tabs without page reloads.
*   Customizable settings for AI style, tone, and output length.
*   All user data is stored locally.

## How to Install and Test Locally

To load and test this extension in your own Chrome browser, follow these steps:

1.  **Get the Code:**
    *   Make sure you have all the extension files (`manifest.json`, `background.js`, `content_script.js`, etc.) in a single folder on your computer.

2.  **Open Chrome Extensions Page:**
    *   Open Google Chrome.
    *   Navigate to `chrome://extensions` in the address bar.

3.  **Enable Developer Mode:**
    *   In the top-right corner of the Extensions page, find the "Developer mode" toggle and turn it **on**.

4.  **Load the Extension:**
    *   Three new buttons will appear: "Load unpacked," "Pack extension," and "Update."
    *   Click the **"Load unpacked"** button.
    *   A file selection dialog will open. Navigate to the folder where you saved the extension's files and select it.

5.  **Verify Installation:**
    *   If the extension is loaded successfully, you will see its card appear on the Extensions page.
    *   You should also see the AI Writing Assistant icon (a placeholder for now) in your Chrome toolbar.

## How to Use

1.  **Navigate to any web page** with a text field (like a Google Doc, a social media post, or an email).
2.  Activate the assistant panel in one of two ways:
    *   **Click the floating ✨ button** in the bottom-right corner of the page.
    *   **Use the keyboard shortcut:** `Ctrl+Shift+U` (or `Cmd+Shift+U` on Mac).
3.  Click on an editable area to ensure the assistant knows where to insert text.
4.  Use the toolbar buttons to get AI suggestions (currently placeholder text).
5.  Click the "Insert" button to add the suggested text to your document.
6.  Click the extension icon in the Chrome toolbar and then "Customize AI Settings" to open the options page and configure your API key and preferences.
