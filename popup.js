document.addEventListener("DOMContentLoaded", () => {
    const speedInput = document.getElementById("speedInput");
    const saveButton = document.getElementById("saveButton");
  
    chrome.storage.sync.get(["playbackSpeed"], (result) => {
      speedInput.value = result.playbackSpeed !== undefined ? result.playbackSpeed : 1.0;
    });
  
    saveButton.addEventListener("click", () => {
      const newSpeed = parseFloat(speedInput.value);
      chrome.storage.sync.set({ playbackSpeed: newSpeed }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: "SET_PLAYBACK_SPEED", speed: newSpeed });
        });
      });
    });
  });
  