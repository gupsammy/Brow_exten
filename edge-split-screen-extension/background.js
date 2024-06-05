chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'data:text/html,<html><body><iframe src="https://chat.openai.com" style="width: 50%; height: 100vh; border: none;"></iframe><iframe src="https://www.perplexity.ai" style="width: 50%; height: 100vh; border: none;"></iframe></body></html>', active: true });
});