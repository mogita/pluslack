const enableJiraLinkConverterField = document.getElementById('enable_jira_link_converter_field')
const enableJiraLinkConverter = document.getElementById('enable_jira_link_converter')
const urlPrefix = document.getElementById('url_prefix')
const saveButton = document.getElementById('save_button')
const welcome = document.getElementById('welcome')
const urlPrefixWarning = document.getElementById('url_prefix_warning')

const theLocation = window.location.href
const url = new URL(theLocation)
const firstRun = url.searchParams.get('firstrun')

if (firstRun) {
  chrome.storage.sync.set({ enable_jira_link_converter: true })
  welcome.style.display = 'block'
  enableJiraLinkConverterField.style.display = 'none'
}

document.body.onload = function() {
  // restore configs
  chrome.storage.sync.get({ enable_jira_link_converter: true, url_prefix: '' }, function(data) {
    enableJiraLinkConverter.checked = data.enable_jira_link_converter
    urlPrefix.value = data.url_prefix
  })
}

function handleEnableJiraLinkConverter() {
  const value = enableJiraLinkConverter.checked
  chrome.storage.sync.set({ enable_jira_link_converter: value })
}

function handleUrlPrefixSave() {
  const value = urlPrefix.value
  if (!value && firstRun) {
    urlPrefixWarning.style.display = 'block'
    return false
  }

  chrome.storage.sync.set({ url_prefix: value })

  if (firstRun) {
    window.close()
  }
}

urlPrefix.onkeydown = function() {
  urlPrefixWarning.style.display = 'none'
}

enableJiraLinkConverter.onclick = handleEnableJiraLinkConverter
saveButton.onclick = handleUrlPrefixSave
