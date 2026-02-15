(function() {
  'use strict';
  
  const CONFIG = {
    hoverDelay: 50,
    maxPrefetches: 30,
    maxConcurrent: 3,
    imagePrefetchDelay: 50
  };

  const state = {
    prefetched: new Set(),
    prefetching: new Set(),
    activePrefetches: 0,
    prefetchCount: 0,
    imagePrefetchCount: 0
  };

  function standardPrefetch(url) {
    if (state.prefetched.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
    
    state.prefetched.add(url);
    console.log('[Prefetch] Page:', url);
    
    setTimeout(() => link.remove(), 30000);
  }

  function prefetchImage(url) {
    if (state.prefetched.has(url)) return;
    if (state.imagePrefetchCount >= 20) return;
    
    const img = new Image();
    img.src = url;
    
    state.prefetched.add(url);
    state.imagePrefetchCount++;
    console.log('[Prefetch] Image:', url);
  }

  function prefetchImagesOnPage(url) {
    if (state.prefetching.has(url)) return;
    state.prefetching.add(url);
    
    setTimeout(() => {
      fetch(url, { method: 'GET', mode: 'no-cors', credentials: 'same-origin' })
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const images = doc.querySelectorAll('img[src]');
          
          images.forEach((img, index) => {
            setTimeout(() => {
              const src = new URL(img.src, url).href;
              prefetchImage(src);
            }, index * CONFIG.imagePrefetchDelay);
          });
          
          console.log('[Prefetch] Found', images.length, 'images on', url);
        })
        .catch(err => console.log('[Prefetch] Could not parse images:', err))
        .finally(() => state.prefetching.delete(url));
    }, 500);
  }

  let hoverTimeout;
  
  function onMouseEnter(e) {
    if (!e.target || typeof e.target.closest !== 'function') return;
    
    const link = e.target.closest('a');
    if (!link || !link.href) return;
    if (!link.href.startsWith('http')) return;
    if (link.href === window.location.href) return;
    if (state.prefetchCount >= CONFIG.maxPrefetches) return;

    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      standardPrefetch(link.href);
      prefetchImagesOnPage(link.href);
      state.prefetchCount++;
    }, CONFIG.hoverDelay);
  }

  function onMouseLeave(e) {
    if (!e.target || typeof e.target.closest !== 'function') {
      clearTimeout(hoverTimeout);
      return;
    }
    clearTimeout(hoverTimeout);
  }

  document.addEventListener('mouseenter', onMouseEnter, true);
  document.addEventListener('mouseleave', onMouseLeave, true);
  
  console.log('[Prefetch] Extension loaded with image support');
})();
