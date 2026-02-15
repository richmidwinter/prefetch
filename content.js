(function() {
  'use strict';
  
  const CONFIG = {
    hoverDelay: 50,
    maxPrefetches: 30,
    maxConcurrent: 3
  };

  const state = {
    prefetched: new Set(),
    prefetching: new Set(),
    activePrefetches: 0,
    prefetchCount: 0
  };

  function standardPrefetch(url) {
    if (state.prefetched.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
    
    state.prefetched.add(url);
    console.log('[Prefetch] Prefetching:', url);
    
    setTimeout(() => link.remove(), 30000);
  }

  let hoverTimeout;
  
  function onMouseEnter(e) {
    // Safety check: ensure target is an Element
    if (!e.target || typeof e.target.closest !== 'function') return;
    
    const link = e.target.closest('a');
    if (!link || !link.href) return;
    if (!link.href.startsWith('http')) return;
    if (link.href === window.location.href) return;
    if (state.prefetchCount >= CONFIG.maxPrefetches) return;

    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      standardPrefetch(link.href);
      state.prefetchCount++;
    }, CONFIG.hoverDelay);
  }

  function onMouseLeave(e) {
    // Safety check: ensure target is an Element before calling closest
    if (!e.target || typeof e.target.closest !== 'function') {
      clearTimeout(hoverTimeout);
      return;
    }
    
    const link = e.target.closest('a');
    if (!link) {
      clearTimeout(hoverTimeout);
      return;
    }
    
    clearTimeout(hoverTimeout);
  }

  document.addEventListener('mouseenter', onMouseEnter, true);
  document.addEventListener('mouseleave', onMouseLeave, true);
  
  console.log('[Prefetch] Extension loaded');
})();
