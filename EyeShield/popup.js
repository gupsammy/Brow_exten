document.addEventListener('DOMContentLoaded', function() {
  const colorPreview = document.getElementById('colorPreview');
  const colorOptions = document.getElementById('colorOptions');
  const opacitySlider = document.getElementById('opacitySlider');
  const opacityValue = document.getElementById('opacityValue');
  const applyButton = document.getElementById('applyButton');
  const resetButton = document.getElementById('resetButton');
  const modeToggle = document.getElementById('modeToggle');

  const colors = [
    '#FF5733', '#FFC300', '#DAF7A6', '#FF3333',
    '#33FF57', '#3357FF', '#FF33F1', '#33FFF1',
    '#00E5FF', '#7B2FF7', '#F72F93', '#2FF7B3'
  ];

  let currentColor = colors[0];

  // Create color options
  colors.forEach(color => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    colorOption.style.backgroundColor = color;
    colorOption.addEventListener('click', () => {
      currentColor = color;
      colorPreview.style.backgroundColor = color;
    });
    colorOptions.appendChild(colorOption);
  });

  // Initialize color preview
  colorPreview.style.backgroundColor = currentColor;

  chrome.storage.sync.get(['color', 'opacity'], function(result) {
    if (result.color) {
      currentColor = result.color;
      colorPreview.style.backgroundColor = currentColor;
    }
    if (result.opacity) {
      opacitySlider.value = result.opacity;
      opacityValue.textContent = `Opacity: ${result.opacity}%`;
    }
  });

  opacitySlider.addEventListener('input', function() {
    opacityValue.textContent = `Opacity: ${this.value}%`;
  });

  applyButton.addEventListener('click', function() {
    const opacity = opacitySlider.value;
    chrome.storage.sync.set({color: currentColor, opacity: opacity}, function() {
      console.log('Settings saved');
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "applyFilter",
        color: currentColor,
        opacity: opacity / 100
      });
    });
  });

  resetButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "removeFilter"
      });
    });
    currentColor = colors[0];
    colorPreview.style.backgroundColor = currentColor;
    opacitySlider.value = 50;
    opacityValue.textContent = "Opacity: 50%";
    chrome.storage.sync.clear(function() {
      console.log('Settings cleared');
    });
  });

  modeToggle.addEventListener('change', function() {
    document.body.classList.toggle('light-mode');
    // Additional logic for changing other elements' colors
  });
});