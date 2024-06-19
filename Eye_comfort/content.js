chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'applyOverlay') {
      applyOverlay(request.color, request.opacity);
    }
  });
  
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