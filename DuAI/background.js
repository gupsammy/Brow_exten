chrome.action.onClicked.addListener(async (tab) => {
    // Open Perplexity AI in the current tab
    await chrome.tabs.update(tab.id, { url: 'https://www.perplexity.ai/' });
  
    // Prompt user to choose between ChatGPT and ClaudeAI
    const choice = await chrome.windows.create({
      url: 'chrome-extension://' + chrome.runtime.id + '/choice.html',
      type: 'popup',
      width: 300,
      height: 200
    });
  
    // Listen for the user's choice
    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
      if (request.action === "openAI") {
        let aiTab;
        if (request.choice === "chatgpt") {
          aiTab = await chrome.tabs.create({ url: 'https://chat.openai.com/', active: false });
        } else if (request.choice === "claude") {
          aiTab = await chrome.tabs.create({ url: 'https://claude.ai', active: false });
        }
  
        // Move the AI tab next to the Perplexity AI tab
        await chrome.tabs.move(aiTab.id, { index: tab.index + 1 });
  
        // Activate split screen view
        await chrome.tabs.update(tab.id, { highlighted: true });
        await chrome.tabs.update(aiTab.id, { highlighted: true });
  
        // Close the popup window
        chrome.windows.remove(choice.id);
      }
    });
  });