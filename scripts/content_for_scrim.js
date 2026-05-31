(async () => {
  // Obtain the first topic under the first toc-root
  const firstTopic = getFirstTopic();
  const result = await chrome.runtime.sendMessage({
    key: 'badge'
  });
  const scrimListActive = result?.badge === 'ON';

  if (firstTopic && scrimListActive) {
    setNumberedTitles(firstTopic);
  }
})();

// A very concise, structural approach to obtain the first topic
function getFirstTopic() {
  return document.querySelector('toc-root')?.children[1]?.children[0];
}

const separator = " | ";
// Render all topics as numbered list starting at firstTopic
function setNumberedTitles(firstTopic) {
  const topicsList = firstTopic.parentElement.childNodes;
  // Type of course is either nested or a simple list of scrims
  const tagName = firstTopic.tagName;
  if (tagName !== 'TOC-GROUP' && tagName !== 'TOC-SCRIM-ITEM') return;
  const nestedCourse = tagName === 'TOC-GROUP';

  topicsList.forEach((currentTopic, i) => {
    const title = nestedCourse ? getNestedTitle(currentTopic) : getSimpleTitle(currentTopic);

    if (title) setTopicTitle(title, i + 1);
  });
}

// Getting the title also relies on the structure of the page
function getNestedTitle(topic) { // Title is a span element for nested courses
  const nestedTitle = topic?.children[0]?.children[0]?.children[1]?.children[0];
  return nestedTitle ?? getSimpleTitle(topic);
}

// The title is within a div element
function getSimpleTitle(topic) {
  return topic?.children[1]?.children[1]?.children[0];
}

// The same approach is applicable to both types of title
function setTopicTitle(title, numberToSet) {
  // Neet to review the approach below as it would not work if title has the separator.
  if (title.textContent.includes(separator)) return;
  const prefix = numberToSet < 10 ? '0' : '';
  title.textContent = `${prefix}${numberToSet}${separator}${title.textContent}`;
}
