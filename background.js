// Background script for extension management
// Handles extension lifecycle and can be extended for advanced features

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Prefetch Extension] Installed');
});

// Optional: Clear prefetch cache periodically
chrome.alarms?.create('cleanup', { periodInMinutes: 5 });

chrome.alarms?.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    // Cleanup logic if needed
  }
});
