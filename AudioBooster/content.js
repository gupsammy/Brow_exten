
  // content.js
  let audioContext;
  let source;
  let gainNode;
  let noiseReduction;
  let analyser;
  let settings = {boostEnabled: false, volumeBoost: 1, noiseReduction: false};
  let audioInitialized = false;
  let visualizerIntervalId;
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleBoost") {
      settings.boostEnabled = request.value;
      applySettings();
      sendResponse({success: true});
    } else if (request.action === "toggleBoostKeyboard") {
      settings.boostEnabled = !settings.boostEnabled;
      applySettings();
      chrome.runtime.sendMessage({action: "updatePopup", settings: settings});
      sendResponse({success: true});
    } else if (request.action === "setVolume") {
      settings.volumeBoost = request.value;
      applySettings();
      sendResponse({success: true});
    } else if (request.action === "toggleNoiseReduction") {
      settings.noiseReduction = request.value;
      applySettings();
      sendResponse({success: true});
    } else if (request.action === "getState") {
      sendResponse({state: settings});
    } else if (request.action === "startVisualizer") {
      startVisualizer();
      sendResponse({success: true});
    }
    return true;  // Indicates that the response is sent asynchronously
  });
  
  function initAudio() {
    if (!audioInitialized) {
      const audioElement = document.querySelector('video, audio');
      if (audioElement) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audioElement);
        gainNode = audioContext.createGain();
        noiseReduction = audioContext.createDynamicsCompressor();
        analyser = audioContext.createAnalyser();
        
        source.connect(gainNode);
        gainNode.connect(noiseReduction);
        noiseReduction.connect(analyser);
        analyser.connect(audioContext.destination);
        
        audioInitialized = true;
      }
    }
  }
  
  function applySettings() {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    if (!audioInitialized) {
      initAudio();
    }
    
    if (audioInitialized) {
      if (settings.boostEnabled) {
        gainNode.gain.setValueAtTime(settings.volumeBoost, audioContext.currentTime);
      } else {
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
      }
      
      if (settings.noiseReduction) {
        noiseReduction.threshold.setValueAtTime(-50, audioContext.currentTime);
        noiseReduction.knee.setValueAtTime(40, audioContext.currentTime);
        noiseReduction.ratio.setValueAtTime(12, audioContext.currentTime);
        noiseReduction.attack.setValueAtTime(0, audioContext.currentTime);
        noiseReduction.release.setValueAtTime(0.25, audioContext.currentTime);
      } else {
        noiseReduction.threshold.setValueAtTime(-100, audioContext.currentTime);
        noiseReduction.knee.setValueAtTime(0, audioContext.currentTime);
        noiseReduction.ratio.setValueAtTime(1, audioContext.currentTime);
      }
    }
    
    // Save settings
    chrome.storage.local.set({[chrome.runtime.id]: settings});
  }
  
  function startVisualizer() {
    if (!audioInitialized) {
      initAudio();
    }
  
    if (audioInitialized && !visualizerIntervalId) {
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
  
      visualizerIntervalId = setInterval(() => {
        analyser.getByteTimeDomainData(dataArray);
        chrome.runtime.sendMessage({action: "visualizerData", data: Array.from(dataArray)});
      }, 50);  // Update every 50ms
    }
  }
  
  // Initialize audio on user interaction
  document.addEventListener('click', initAudio, {once: true});
  
  // Load settings when the content script is injected
  chrome.storage.local.get(String(chrome.runtime.id), function(data) {
    if (data[chrome.runtime.id]) {
      settings = data[chrome.runtime.id];
      applySettings();
    }
  });
  
  // Reset settings on page refresh
  window.addEventListener('beforeunload', function() {
    chrome.storage.local.remove(String(chrome.runtime.id));
    if (visualizerIntervalId) {
      clearInterval(visualizerIntervalId);
    }
  });
  