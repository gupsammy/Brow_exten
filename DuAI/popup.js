document.getElementById('perplexity').addEventListener('click', () => openAI('perplexity'));
document.getElementById('chatgpt').addEventListener('click', () => openAI('chatgpt'));
document.getElementById('claude').addEventListener('click', () => openAI('claude'));

function openAI(aiChoice) {
  chrome.runtime.sendMessage({action: "openAI", choice: aiChoice}, function(response) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log('Message sent successfully');
      window.close();
    }
  });
}