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
  
  function applyOverlay(color, opacity) {
    const overlay = document.createElement('div');
    overlay.id = 'eye-shield-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = color;
    overlay.style.opacity = opacity;
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);
  }