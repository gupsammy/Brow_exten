// background.js

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ overlayState: { color: '#ffff00', opacity: 0.3, active: false } });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveOverlayState') {
      chrome.storage.local.set({ overlayState: request.state });
    } else if (request.action === 'getOverlayState') {
      chrome.storage.local.get('overlayState', (data) => {
        sendResponse(data.overlayState);
      });
      return true; // Keep the message channel open for sendResponse
    }
  });