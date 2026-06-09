chrome.runtime.onInstalled.addListener(async () => {
  await chrome.action.setBadgeText({ text: 'ON' })
  chrome.tabs.create({ url: 'onboarding/index.html' });
});

chrome.action.onClicked.addListener(async () => {
  const current = await getActive();
  await setActive(current === 'ON' ? '' : 'ON');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.key === 'badge') {
    handleBadgeMessage().then(sendResponse);
    return true;
  }
});

async function getActive() {
  const badge = await chrome.action.getBadgeText({});
  return badge ? badge: 'OFF';
}

async function setActive(value) {
  await chrome.action.setBadgeText({ text: value });
}

async function handleBadgeMessage() {
  const active = await getActive();
  return { badge: active };
}
