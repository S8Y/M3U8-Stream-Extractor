browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.sendMessage(tab.id, { action: "extractM3U" })
    .then(response => {
      if (response && response.m3uLinks && response.m3uLinks.length > 0) {
        copyToClipboard(response.m3uLinks[0])
          .then(() => {
            browser.notifications.create({
              type: 'basic',
              iconUrl: 'icons/icon48.png',
              title: 'Stream Extractor',
              message: `Found ${response.m3uLinks.length} stream link(s). First link copied!`
            })
          })
      } else {
        browser.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Stream Extractor',
          message: 'No stream links found on this page'
        })
      }
    })
    .catch(error => {
      console.error('Error extracting streams:', error)
    })
})

function copyToClipboard(text) {
  return browser.tabs.executeScript({
    code: `
      const textarea = document.createElement('textarea');
      textarea.value = '${text.replace(/'/g, "\\'")}';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    `
  })
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAllM3uLinks') {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, { action: 'extractM3U' })
          .then(response => {
            sendResponse(response)
          })
      })
    return true
  }
})