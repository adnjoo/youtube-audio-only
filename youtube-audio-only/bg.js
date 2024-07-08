// Initialize the extension state
chrome.storage.local.get(['extensionState'], function(result) {
  if (result.extensionState === undefined) {
    chrome.storage.local.set({extensionState: 'OFF'});
    chrome.action.setBadgeText({ text: "OFF" });
  } else {
    chrome.action.setBadgeText({ text: result.extensionState });
    if (result.extensionState === 'ON') {
      applyCSS();
    }
  }
});

// Function to apply CSS
function applyCSS() {
  chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.scripting.insertCSS({
        files: ["styles.css"],
        target: { tabId: tab.id },
      });
    });
  });
}

// Function to remove CSS
function removeCSS() {
  chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.scripting.removeCSS({
        files: ["styles.css"],
        target: { tabId: tab.id },
      });
    });
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  // Retrieve the current state from storage
  chrome.storage.local.get(['extensionState'], function(result) {
    const prevState = result.extensionState;
    const nextState = prevState === "ON" ? "OFF" : "ON";
    
    // Update the state in storage
    chrome.storage.local.set({extensionState: nextState});
    
    // Set the action badge to the next state
    chrome.action.setBadgeText({
      text: nextState,
    });
    
    if (nextState === "ON") {
      applyCSS();
    } else {
      removeCSS();
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
    chrome.storage.local.get(['extensionState'], function(result) {
      if (result.extensionState === 'ON') {
        chrome.scripting.insertCSS({
          files: ["styles.css"],
          target: { tabId: tabId },
        });
      }
    });
  }
});
