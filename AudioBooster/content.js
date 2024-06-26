
  let audioContext;
  let source;
  let gainNode;
  let noiseReduction;
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "setVolume") {
      setVolume(request.value);
    } else if (request.action === "toggleNoiseReduction") {
      toggleNoiseReduction(request.value);
    }
    sendResponse({success: true});  // Add this line to acknowledge the message
  });
  
  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      source = audioContext.createMediaElementSource(document.querySelector('video, audio'));
      gainNode = audioContext.createGain();
      noiseReduction = audioContext.createDynamicsCompressor();
      
      source.connect(gainNode);
      gainNode.connect(noiseReduction);
      noiseReduction.connect(audioContext.destination);
    }
  }
  
  function setVolume(value) {
    initAudio();
    gainNode.gain.setValueAtTime(value, audioContext.currentTime);
  }
  
  function toggleNoiseReduction(enabled) {
    initAudio();
    if (enabled) {
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
  