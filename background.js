chrome.runtime.onInstalled.addListener(function(object) {
  if (chrome.runtime.OnInstalledReason.INSTALL === object.reason) {
    chrome.tabs.create({ url: chrome.extension.getURL('popup.html') + '?firstrun=1' })
  }
})
