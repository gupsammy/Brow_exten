chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openAI") {
      handleAIChoice(request.choice);
      sendResponse({status: "success"});
    }
    return true;  // Indicates that the response is sent asynchronously
  });
  
  async function handleAIChoice(choice) {
    let url;
    switch(choice) {
      case 'perplexity':
        url = 'https://www.perplexity.ai/';
        break;
      case 'chatgpt':
        url = 'https://chat.openai.com/';
        break;
      case 'claude':
        url = 'https://claude.ai';
        break;
    }
  
    // Open the chosen AI assistant in a new tab
    await chrome.tabs.create({ url: url });
  }