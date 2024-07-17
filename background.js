chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ playbackSpeed: 1.0 });
  });
  