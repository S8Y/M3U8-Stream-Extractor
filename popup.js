document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractBtn')
  const statusDiv = document.getElementById('status')
  const resultsDiv = document.getElementById('results')
  
  extractBtn.addEventListener('click', function() {
    extractBtn.disabled = true
    extractBtn.textContent = 'Scanning...'
    showStatus('info', 'Searching for stream links...')
    
    browser.runtime.sendMessage({ action: 'getAllM3uLinks' })
      .then(response => {
        if (response && response.m3uLinks && response.m3uLinks.length > 0) {
          displayResults(response.m3uLinks)
          showStatus('success', `Found ${response.m3uLinks.length} stream${response.m3uLinks.length === 1 ? '' : 's'}`)
          
          if (response.m3uLinks.length === 1) {
            copyToClipboard(response.m3uLinks[0])
          }
        } else {
          showStatus('error', 'No stream links found')
          resultsDiv.innerHTML = '<div class="no-results">😕 No stream links detected</div>'
        }
      })
      .catch(error => {
        console.error('Error:', error)
        showStatus('error', 'Failed to extract links')
      })
      .finally(() => {
        extractBtn.disabled = false
        extractBtn.textContent = 'Extract Stream Links'
      })
  })
  
  function showStatus(type, message) {
    statusDiv.className = `status ${type}`
    statusDiv.textContent = message
    statusDiv.style.display = 'block'
    
    if (type === 'success') {
      setTimeout(() => {
        statusDiv.style.display = 'none'
      }, 3000)
    }
  }
  
  function displayResults(links) {
    resultsDiv.innerHTML = ''
    
    links.forEach((link, index) => {
      const linkItem = document.createElement('div')
      linkItem.className = 'link-item'
      linkItem.textContent = link
      
      linkItem.addEventListener('click', function() {
        copyToClipboard(link)
        
        document.querySelectorAll('.link-item').forEach(item => {
          item.classList.remove('copied')
        })
        linkItem.classList.add('copied')
        
        showStatus('success', 'Link copied!')
      })
      
      resultsDiv.appendChild(linkItem)
    })
  }
  
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
})