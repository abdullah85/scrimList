chrome.runtime.onInstalled.addListener(async () => {
  await Promise.all([
    chrome.storage.local.set({ badge: 'ON' }),
    chrome.action.setBadgeText({ text: 'ON' })
  ]);
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
  const { badge } = await chrome.storage.local.get('badge');
  // fallback to ON when badge is undefined or null (not likely)
  return badge ?? 'ON';
}

async function setActive(value) {
  await Promise.all([
    chrome.storage.local.set({ badge: value }),
    chrome.action.setBadgeText({ text: value })
  ]);
}

async function handleBadgeMessage() {
  const active = await getActive();
  await chrome.action.setBadgeText({ text: active }); // re-sync badge on wake
  return { badge: active };
}
