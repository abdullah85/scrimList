// Initially it is active
const statusKey = 'scrimListActive'
chrome.storage.local.set({ scrimListActive: true });
// When active, the badge is ON, empty otherwise
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'ON'
  });
});

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({});
  const nextState = prevState === 'ON' ? '' : 'ON';
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    text: nextState
  });

  if (nextState == 'ON') {
    chrome.storage.local.set({ scrimListActive: true });
  } else {
    chrome.storage.local.set({ scrimListActive: false });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.status == statusKey) {
    chrome.storage.local.get(statusKey).then(sendResponse);
    return true;
  }
});
