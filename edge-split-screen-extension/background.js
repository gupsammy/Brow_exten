chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'https://chat.openai.com', active: true }, (tab1) => {
      chrome.tabs.create({ url: 'https://www.perplexity.ai', active: false }, (tab2) => {
        // Move tabs to split screen mode
        // Note: Edge API for split screen might be different or not available, you might need to use a custom solution.
      });
    });
  });