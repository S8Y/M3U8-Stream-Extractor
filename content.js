function extractM3UFromPage() {
  const extractedLinks = []

  function isValidUrl(string) {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  function normalizeUrl(url) {
    if (!url) return null
    
    if (url.startsWith('//')) {
      url = window.location.protocol + url
    } else if (url.startsWith('/')) {
      url = window.location.origin + url
    } else if (!url.startsWith('http')) {
      url = window.location.origin + '/' + url
    }
    
    return isValidUrl(url) ? url : null
  }

  function method1_directLinks() {
    const selectors = [
      'a[href$=".m3u"]',
      'a[href$=".m3u8"]',
      'source[src$=".m3u"]',
      'source[src$=".m3u8"]',
      'video source[src*=".m3u"]',
      'audio source[src*=".m3u"]'
    ]

    const elements = document.querySelectorAll(selectors.join(','))
    const links = []
    
    elements.forEach(element => {
      const url = element.href || element.src
      const normalized = normalizeUrl(url)
      if (normalized && !links.includes(normalized)) {
        links.push(normalized)
      }
    })

    return links
  }

  function method2_playlistFiles() {
    const playlistLinks = []
    
    const scripts = document.querySelectorAll('script')
    scripts.forEach(script => {
      const content = script.textContent || script.innerHTML
      
      const m3uMatches = content.match(/['"`]([^'"`]*\.m3u8?)['"`]/g)
      if (m3uMatches) {
        m3uMatches.forEach(match => {
          const url = match.replace(/['"`]/g, '')
          const normalized = normalizeUrl(url)
          if (normalized && !playlistLinks.includes(normalized)) {
            playlistLinks.push(normalized)
          }
        })
      }
    })

    return playlistLinks
  }

  function method3_networkRequests() {
    const networkLinks = []
    
    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource')
      resources.forEach(resource => {
        if (resource.name.includes('.m3u') || resource.name.includes('.m3u8')) {
          const normalized = normalizeUrl(resource.name)
          if (normalized && !networkLinks.includes(normalized)) {
            networkLinks.push(normalized)
          }
        }
      })
    }

    return networkLinks
  }

  function method4_iframeAndEmbed() {
    const embedLinks = []
    
    const iframes = document.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
        if (iframeDoc) {
          const iframeElements = iframeDoc.querySelectorAll('a[href$=".m3u"], a[href$=".m3u8"], source[src$=".m3u"], source[src$=".m3u8"]')
          iframeElements.forEach(element => {
            const url = element.href || element.src
            const normalized = normalizeUrl(url)
            if (normalized && !embedLinks.includes(normalized)) {
              embedLinks.push(normalized)
            }
          })
        }
      } catch (e) {
        // Cross-origin iframe, ignore
      }
    })

    const embeds = document.querySelectorAll('embed, object')
    embeds.forEach(element => {
      const url = element.src || element.data
      if (url && (url.includes('.m3u') || url.includes('.m3u8'))) {
        const normalized = normalizeUrl(url)
        if (normalized && !embedLinks.includes(normalized)) {
          embedLinks.push(normalized)
        }
      }
    })

    return embedLinks
  }

  function method5_textPatterns() {
    const textLinks = []
    
    const bodyText = document.body.textContent || document.body.innerText
    const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]*\.m3u8?/gi
    const matches = bodyText.match(urlPattern)
    
    if (matches) {
      matches.forEach(url => {
        const normalized = normalizeUrl(url)
        if (normalized && !textLinks.includes(normalized)) {
          textLinks.push(normalized)
        }
      })
    }

    return textLinks
  }

  function method6_metaTags() {
    const metaLinks = []
    
    const metaTags = document.querySelectorAll('meta[property*="video"], meta[name*="stream"], meta[property*="audio"]')
    metaTags.forEach(tag => {
      const content = tag.content || tag.value
      if (content && (content.includes('.m3u') || content.includes('.m3u8'))) {
        const normalized = normalizeUrl(content)
        if (normalized && !metaLinks.includes(normalized)) {
          metaLinks.push(normalized)
        }
      }
    })

    return metaLinks
  }

  const methods = [
    { name: 'Direct Links', func: method1_directLinks },
    { name: 'Playlist Files', func: method2_playlistFiles },
    { name: 'Network Requests', func: method3_networkRequests },
    { name: 'Iframe and Embed', func: method4_iframeAndEmbed },
    { name: 'Text Patterns', func: method5_textPatterns },
    { name: 'Meta Tags', func: method6_metaTags }
  ]

  for (const method of methods) {
    try {
      const results = method.func()
      if (results && results.length > 0) {
        results.forEach(link => {
          if (!extractedLinks.includes(link)) {
            extractedLinks.push(link)
          }
        })
        break
      }
    } catch (error) {
      console.warn(`Method ${method.name} failed:`, error)
    }
  }

  if (extractedLinks.length === 0) {
    for (const method of methods.slice(1)) {
      try {
        const results = method.func()
        if (results && results.length > 0) {
          results.forEach(link => {
            if (!extractedLinks.includes(link)) {
              extractedLinks.push(link)
            }
          })
        }
      } catch (error) {
        console.warn(`Method ${method.name} failed:`, error)
      }
    }
  }

  return {
    m3uLinks: extractedLinks,
    count: extractedLinks.length
  }
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractM3U') {
    const result = extractM3UFromPage()
    sendResponse(result)
  }
})