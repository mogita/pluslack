const runner = setInterval(main, 1000)

let urlPrefixCache = ''

function restoreConvertedLinks() {
  const pluslackeds = document.querySelectorAll('span[data-pluslack="converted"]')
  for (item of pluslackeds) {
    item.innerHTML = item.dataset.pluslackOriginal
  }
}

function main() {
  chrome.storage.sync.get({ enable_jira_link_converter: true, url_prefix: '' }, function(data) {
    if (chrome.runtime.error) {
      clearInterval(runner)
      return false
    }

    // exit if no url prefix is provided
    if (data.url_prefix === '') return false

    // restore texts and exit if disabled
    if (data.enable_jira_link_converter === false) {
      restoreConvertedLinks()

      return false
    }

    // restore texts if url prefix changed
    if (urlPrefixCache !== data.url_prefix) {
      restoreConvertedLinks()
    }

    urlPrefixCache = data.url_prefix

    // add tailing slash if not present at the end of url prefix
    if (data.url_prefix[data.url_prefix.length - 1] !== '/') {
      data.url_prefix = data.url_prefix + '/'
    }

    // compose regex
    const rule = new RegExp(`( |\\b|^)(?<!${data.url_prefix}|data-pluslack-original=")[a-zA-Z]+-\\d+(?!-)\\b`, 'g')

    // match and modify
    const messages = document.querySelectorAll('.c-message__body, .message_body')

    for (message of messages) {
      let matched = message.innerText || message.textContent
      matched = matched.replace(/<[^>]*>/g, '')
      matched = matched.match(rule)

      if (matched) {
        matched[0] = matched[0].trim()
        const matched1 = matched[0].split('-')[0]
        const matched2 = matched[0].split('-')[1]
        message.innerHTML = message.innerHTML.replace(
          rule,
          `<span data-pluslack="converted" data-pluslack-original="${matched[0]}" style="margin: 0 4px;"><a href="${
            data.url_prefix
          }${matched[0].toUpperCase()}" target="_blank"><span style="margin-right: 4px;"><img style="width: 16px;" src="https://emoji.slack-edge.com/T041QRPTJ/jira/59a0b2c33c3236d8.png" /></span>${matched1.toUpperCase()}<span>-</span>${matched2}</a></span>`,
        )
      }
    }
  })
}
