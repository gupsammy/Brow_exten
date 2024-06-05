chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'https://chat.openai.com', active: true }, (tab1) => {
    chrome.tabs.create({ url: 'https://www.perplexity.ai', active: false }, (tab2) => {
      // Arrange tabs for split screen
      chrome.windows.create({
        tabId: tab1.id,
        type: 'normal'
      }, (window) => {
        chrome.windows.create({
          tabId: tab2.id,
          type: 'normal'
        });
      });
    });
  });
});