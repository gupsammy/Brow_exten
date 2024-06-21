let filterElement = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "applyFilter") {
    applyFilter(request.color, request.opacity);
  } else if (request.action === "removeFilter") {
    removeFilter();
  }
});

function applyFilter(color, opacity) {
  removeFilter(); // Remove existing filter if any
  
  filterElement = document.createElement('div');
  filterElement.style.position = 'fixed';
  filterElement.style.top = '0';
  filterElement.style.left = '0';
  filterElement.style.width = '100%';
  filterElement.style.height = '100%';
  filterElement.style.backgroundColor = color;
  filterElement.style.opacity = opacity;
  filterElement.style.pointerEvents = 'none';
  filterElement.style.zIndex = '9999999';
  
  document.body.appendChild(filterElement);
}

function removeFilter() {
  if (filterElement) {
    filterElement.remove();
    filterElement = null;
  }
}