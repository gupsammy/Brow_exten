
  // background.js
  chrome.runtime.onInstalled.addListener(function() {
    console.log("Audio Booster initialized");
  });
  
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      chrome.storage.local.remove(String(tabId));
    }
  });
  
  chrome.commands.onCommand.addListener(function(command) {
    if (command === "toggle-audio-boost") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleBoostKeyboard"});
      });
    }
  });
  