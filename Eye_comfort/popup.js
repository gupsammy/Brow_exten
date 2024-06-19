document.getElementById('apply').addEventListener('click', () => {
    const color = document.getElementById('color').value;
    const opacity = document.getElementById('opacity').value;
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: applyOverlay,
        args: [color, opacity]
      });
    });
  });
  
  document.getElementById('reset').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: resetOverlay
      });
    });
  });
  
  document.getElementById('savePreset1').addEventListener('click', () => savePreset(1));
  document.getElementById('applyPreset1').addEventListener('click', () => applyPreset(1));
  document.getElementById('savePreset2').addEventListener('click', () => savePreset(2));
  document.getElementById('applyPreset2').addEventListener('click', () => applyPreset(2));
  document.getElementById('savePreset3').addEventListener('click', () => savePreset(3));
  document.getElementById('applyPreset3').addEventListener('click', () => applyPreset(3));
  
  function savePreset(presetNumber) {
    const color = document.getElementById('color').value;
    const opacity = document.getElementById('opacity').value;
    const preset = { color, opacity };
    localStorage.setItem(`preset${presetNumber}`, JSON.stringify(preset));
  }
  
  function applyPreset(presetNumber) {
    const preset = JSON.parse(localStorage.getItem(`preset${presetNumber}`));
    if (preset) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: applyOverlay,
          args: [preset.color, preset.opacity]
        });
      });
    }
  }
  
  function applyOverlay(color, opacity) {
    let overlay = document.getElementById('eye-shield-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'eye-shield-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'none';
      document.body.appendChild(overlay);
    }
    overlay.style.backgroundColor = color;
    overlay.style.opacity = opacity;
  }
  
  function resetOverlay() {
    const overlay = document.getElementById('eye-shield-overlay');
    if (overlay) {
      overlay.remove();
    }
  }