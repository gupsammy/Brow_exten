chrome.action.onClicked.addListener(async (tab) => {
    // Open ChatGPT in the current tab
    await chrome.tabs.update(tab.id, { url: 'https://chat.openai.com/' });
  
    // Open Perplexity AI in a new tab
    let perplexityTab = await chrome.tabs.create({ url: 'https://www.perplexity.ai/', active: false });
    
    // Move the Perplexity AI tab next to the ChatGPT tab
    await chrome.tabs.move(perplexityTab.id, { index: tab.index + 1 });
  
    // Activate split screen view
    await chrome.tabs.update(tab.id, { highlighted: true });
    await chrome.tabs.update(perplexityTab.id, { highlighted: true });
  });