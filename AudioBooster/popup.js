// popup.js
let currentTabId;
let visualizer;

// Moved outside DOMContentLoaded to be globally accessible
function updateUI(settings) {
  const boostToggle = document.getElementById('boostToggle');
  const volumeSlider = document.getElementById('volumeBoost');
  const boostValue = document.getElementById('boostValue');
  const noiseReductionCheckbox = document.getElementById('noiseReduction');

  if (boostToggle && volumeSlider && boostValue && noiseReductionCheckbox) {
    boostToggle.checked = settings.boostEnabled;
    volumeSlider.value = settings.volumeBoost;
    boostValue.textContent = settings.volumeBoost + 'x';
    noiseReductionCheckbox.checked = settings.noiseReduction;
    volumeSlider.disabled = !settings.boostEnabled;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const boostToggle = document.getElementById('boostToggle');
  const volumeSlider = document.getElementById('volumeBoost');
  const boostValue = document.getElementById('boostValue');
  const noiseReductionCheckbox = document.getElementById('noiseReduction');
  const controls = document.getElementById('controls');
  const errorMessage = document.getElementById('error-message');
  const visualizerCanvas = document.getElementById('visualizer');

  visualizer = new AudioVisualizer(visualizerCanvas);

  function showError() {
    controls.style.display = 'none';
    errorMessage.style.display = 'block';
    visualizerCanvas.style.display = 'none';
  }

  function hideError() {
    controls.style.display = 'block';
    errorMessage.style.display = 'none';
    visualizerCanvas.style.display = 'block';
  }

  function sendMessage(message, callback) {
    chrome.tabs.sendMessage(currentTabId, message, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        showError();
      } else if (callback) {
        callback(response);
      }
    });
  }

  function loadSettings(callback) {
    chrome.storage.local.get(currentTabId.toString(), function(data) {
      const settings = data[currentTabId] || {boostEnabled: false, volumeBoost: 1, noiseReduction: false};
      callback(settings);
    });
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentTabId = tabs[0].id;
    if (tabs[0].url.startsWith('chrome://') || tabs[0].url.startsWith('chrome-extension://')) {
      showError();
      return;
    }

    hideError();

    loadSettings(function(settings) {
      updateUI(settings);

      sendMessage({action: "getState"}, function(response) {
        if (response && response.state) {
          updateUI(response.state);
        }
      });

      boostToggle.addEventListener('change', function() {
        settings.boostEnabled = this.checked;
        volumeSlider.disabled = !this.checked;
        sendMessage({action: "toggleBoost", value: this.checked});
      });

      volumeSlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        settings.volumeBoost = value;
        boostValue.textContent = value + 'x';
        sendMessage({action: "setVolume", value: value});
      });

      noiseReductionCheckbox.addEventListener('change', function() {
        settings.noiseReduction = this.checked;
        sendMessage({action: "toggleNoiseReduction", value: this.checked});
      });

      // Start visualizer
      sendMessage({action: "startVisualizer"});
    });
  });
});

// Listen for visualizer data and popup updates from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "visualizerData") {
    visualizer.draw(request.data);
  } else if (request.action === "updatePopup") {
    updateUI(request.settings);
  }
});