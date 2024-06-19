// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ overlayStates: {}, lastSettings: { color: '#ffff00', opacity: 0.3 } });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveOverlayState') {
    chrome.storage.local.get('overlayStates', (data) => {
      const overlayStates = data.overlayStates || {};
      overlayStates[request.tabId] = request.state;
      chrome.storage.local.set({ overlayStates });
    });
  } else if (request.action === 'getOverlayState') {
    chrome.storage.local.get('overlayStates', (data) => {
      const overlayStates = data.overlayStates || {};
      sendResponse(overlayStates[request.tabId] || { color: '#ffff00', opacity: 0.3, active: false });
    });
    return true; // Keep the message channel open for sendResponse
  } else if (request.action === 'saveLastSettings') {
    chrome.storage.local.set({ lastSettings: request.settings });
  } else if (request.action === 'getLastSettings') {
    chrome.storage.local.get('lastSettings', (data) => {
      sendResponse(data.lastSettings || { color: '#ffff00', opacity: 0.3 });
    });
    return true; // Keep the message channel open for sendResponse
  }
});