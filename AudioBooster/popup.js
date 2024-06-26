
document.addEventListener('DOMContentLoaded', function() {
    const volumeSlider = document.getElementById('volumeBoost');
    const boostValue = document.getElementById('boostValue');
    const noiseReductionCheckbox = document.getElementById('noiseReduction');
    const controls = document.getElementById('controls');
    const errorMessage = document.getElementById('error-message');
  
    function showError() {
      controls.style.display = 'none';
      errorMessage.style.display = 'block';
    }
  
    function hideError() {
      controls.style.display = 'block';
      errorMessage.style.display = 'none';
    }
  
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0].url.startsWith('chrome://') || tabs[0].url.startsWith('chrome-extension://')) {
        showError();
        return;
      }
  
      hideError();
  
      volumeSlider.addEventListener('input', function() {
        const value = this.value;
        boostValue.textContent = value + 'x';
        chrome.tabs.sendMessage(tabs[0].id, {action: "setVolume", value: value}, function(response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            showError();
          }
        });
      });
  
      noiseReductionCheckbox.addEventListener('change', function() {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleNoiseReduction", value: noiseReductionCheckbox.checked}, function(response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            showError();
          }
        });
      });
    });
  });
  