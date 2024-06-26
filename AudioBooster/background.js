
  // background.js (unchanged)
  chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({volumeBoost: 1, noiseReduction: false}, function() {
      console.log("Audio Booster initialized");
    });
  });