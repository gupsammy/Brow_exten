document.addEventListener('DOMContentLoaded', function() {
  const colorWheel = new iro.ColorPicker("#colorWheel", {
    width: 200,
    color: "#00e5ff",
    borderWidth: 2,
    borderColor: "#fff",
  });

  const colorPreview = document.getElementById('colorPreview');
  const opacitySlider = document.getElementById('opacitySlider');
  const opacityValue = document.getElementById('opacityValue');
  const applyButton = document.getElementById('applyButton');
  const resetButton = document.getElementById('resetButton');
  const modeToggle = document.getElementById('modeToggle');

  let currentColor = colorWheel.color.hexString;

  chrome.storage.sync.get(['color', 'opacity'], function(result) {
    if (result.color) {
      colorWheel.color.set(result.color);
      currentColor = result.color;
      colorPreview.style.backgroundColor = currentColor;
    }
    if (result.opacity) {
      opacitySlider.value = result.opacity;
      opacityValue.textContent = `Opacity: ${result.opacity}%`;
    }
  });

  colorWheel.on('color:change', function(color) {
    currentColor = color.hexString;
    colorPreview.style.backgroundColor = currentColor;
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
    colorWheel.color.set("#00e5ff");
    opacitySlider.value = 50;
    opacityValue.textContent = "Opacity: 50%";
    chrome.storage.sync.clear(function() {
      console.log('Settings cleared');
    });
  });

  modeToggle.addEventListener('change', function() {
    document.body.classList.toggle('light-mode');
    // You can add more logic here to change other elements' colors
  });
});