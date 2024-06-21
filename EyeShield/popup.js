let colorPicker;
let opacitySlider;
let opacityValue;

const defaultSettings = {
  color: '#322818',
  opacity: 30
};

document.addEventListener('DOMContentLoaded', function() {
  colorPicker = document.getElementById('colorPicker');
  opacitySlider = document.getElementById('opacitySlider');
  opacityValue = document.getElementById('opacityValue');
  
  document.getElementById('applyBtn').addEventListener('click', applyFilter);
  document.getElementById('resetBtn').addEventListener('click', resetFilter);

  colorPicker.addEventListener('input', updateColorPreview);
  opacitySlider.addEventListener('input', updateOpacityValue);

  loadSettings();
});

function loadSettings() {
  chrome.storage.sync.get(['color', 'opacity'], function(result) {
    if (result.color && result.opacity !== undefined) {
      colorPicker.value = result.color;
      opacitySlider.value = result.opacity;
    } else {
      colorPicker.value = defaultSettings.color;
      opacitySlider.value = defaultSettings.opacity;
    }
    updateOpacityValue();
  });
}

function updateColorPreview() {
  // The color picker itself now serves as the preview
}

function updateOpacityValue() {
  opacityValue.textContent = opacitySlider.value + '%';
}

function applyFilter() {
  const color = colorPicker.value;
  const opacity = parseInt(opacitySlider.value);
  
  chrome.storage.sync.set({color: color, opacity: opacity}, function() {
    console.log('Settings saved');
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "applyFilter",
      color: color,
      opacity: opacity / 100
    });
  });
}

function resetFilter() {
  // Set the UI to default values
  colorPicker.value = defaultSettings.color;
  opacitySlider.value = defaultSettings.opacity;
  updateOpacityValue();
  
  // Remove the filter completely
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "removeFilter"
    });
  });

  // Clear the stored settings
  chrome.storage.sync.remove(['color', 'opacity'], function() {
    console.log('Settings cleared');
  });
}