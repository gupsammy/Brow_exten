let audioContext;
let source;
let gainNode;
let noiseReduction;
let analyser;
let settings = {boostEnabled: false, volumeBoost: 1, noiseReduction: false};
let audioInitialized = false;
let visualizerIntervalId;

function initAudio() {
  if (!audioInitialized) {
    const audioElement = document.querySelector('video, audio');
    if (audioElement) {
      try {
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
        applySettings();
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
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
  try {
    chrome.storage.local.set({[chrome.runtime.id]: settings});
  } catch (error) {
    console.error("Error saving settings:", error);
  }
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
      try {
        chrome.runtime.sendMessage({action: "visualizerData", data: Array.from(dataArray)});
      } catch (error) {
        console.error("Error sending visualizer data:", error);
        clearInterval(visualizerIntervalId);
      }
    }, 50);  // Update every 50ms
  }
}

function handleMessage(request, sender, sendResponse) {
  if (request.action === "toggleBoost") {
    settings.boostEnabled = request.value;
    applySettings();
    sendResponse({success: true});
  } else if (request.action === "toggleBoostKeyboard") {
    settings.boostEnabled = !settings.boostEnabled;
    applySettings();
    try {
      chrome.runtime.sendMessage({action: "updatePopup", settings: settings});
    } catch (error) {
      console.error("Error sending update to popup:", error);
    }
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
}

function initExtension() {
  // Remove any existing listeners to avoid duplicates
  chrome.runtime.onMessage.removeListener(handleMessage);
  // Add the message listener
  chrome.runtime.onMessage.addListener(handleMessage);

  // Load settings
  try {
    chrome.storage.local.get(String(chrome.runtime.id), function(data) {
      if (data[chrome.runtime.id]) {
        settings = data[chrome.runtime.id];
        applySettings();
      }
    });
  } catch (error) {
    console.error("Error loading settings:", error);
  }

  // Initialize audio on user interaction
  document.removeEventListener('click', initAudio);
  document.addEventListener('click', initAudio, {once: true});

  // Set up MutationObserver to watch for new video/audio elements
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        const addedNodes = mutation.addedNodes;
        for (let node of addedNodes) {
          if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
            console.log("New audio/video element detected. Reinitializing audio.");
            audioInitialized = false;
            initAudio();
            break;
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the extension
initExtension();

// Handle extension updates or reloads
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popupConnect") {
    port.onDisconnect.addListener(function() {
      console.log("Extension updated or reloaded. Reinitializing.");
      initExtension();
    });
  }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
  try {
    chrome.storage.local.remove(String(chrome.runtime.id));
  } catch (error) {
    console.error("Error removing settings:", error);
  }
  if (visualizerIntervalId) {
    clearInterval(visualizerIntervalId);
  }
});