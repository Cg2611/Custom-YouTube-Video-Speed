let currentSpeed = 1.0;

const loadSpeed = () => {
  chrome.storage.sync.get(["playbackSpeed"], (result) => {
    currentSpeed = result.playbackSpeed !== undefined ? result.playbackSpeed : 1.0;
    setPlaybackSpeed(currentSpeed);
  });
};

const setPlaybackSpeed = (speed) => {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = speed;
  }
};

const createSpeedController = () => {
  const existingBtn = document.getElementsByClassName("speed-btn")[0];
  if (!existingBtn) {
    const speedBtn = document.createElement("img");
    speedBtn.src = chrome.runtime.getURL("assets/speed-icon.png");
    speedBtn.className = "ytp-button speed-btn";
    speedBtn.title = "Click to set playback speed";
    speedBtn.style.width = '32px';  // Set the size of the icon
    speedBtn.style.height = '32px'; // Set the size of the icon
    speedBtn.style.marginTop = '5px'; // Adjust vertical position to align with other icons

    const youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubeLeftControls.appendChild(speedBtn);

    speedBtn.addEventListener("click", () => {
      const newSpeed = prompt("Enter playback speed (e.g., 1.0, 1.5, 2.0):", currentSpeed);
      if (newSpeed) {
        currentSpeed = parseFloat(newSpeed);
        chrome.storage.sync.set({ playbackSpeed: currentSpeed });
        setPlaybackSpeed(currentSpeed);
      }
    });
  }
};

const observeDOM = (function () {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      createSpeedController();
    });
  });

  const config = {
    childList: true,
    subtree: true,
  };

  observer.observe(document.body, config);
})();

loadSpeed();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_PLAYBACK_SPEED") {
    currentSpeed = message.speed;
    setPlaybackSpeed(currentSpeed);
    sendResponse({ status: "success" });
  }
});
