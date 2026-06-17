(async () => {
  const firstTopic = getFirstTopic();

  const result = await chrome.runtime.sendMessage({
    key: 'badge'
  });

  const scrimListActive = result?.badge === 'ON';

  if (firstTopic && scrimListActive) {
    setNumberedTitles(firstTopic);
    observeTocChanges();
  }
})();

const separator = ' | ';

/**
 * Obtain the first topic under the first toc-root.
 */
function getFirstTopic() {
  return document.querySelector('toc-root')?.children[1]?.children[0];
}

/**
 * Render all sibling topics as a numbered list.
 */
function setNumberedTitles(firstTopic) {
  if (!firstTopic) return;

  const tagName = firstTopic.tagName;

  if (tagName !== 'TOC-GROUP' && tagName !== 'TOC-SCRIM-ITEM') {
    return;
  }

  const nestedCourse = tagName === 'TOC-GROUP';

  const topicsList = [...firstTopic.parentElement.children].filter(
    node =>
      node.tagName === 'TOC-GROUP' ||
      node.tagName === 'TOC-SCRIM-ITEM'
  );

  topicsList.forEach((currentTopic, index) => {
    const title = nestedCourse
      ? getNestedTitle(currentTopic)
      : getSimpleTitle(currentTopic);

    if (title) {
      setTopicTitle(title, index + 1);
    }
  });
}

/**
 * Title for nested courses.
 */
function getNestedTitle(topic) {
  const nestedTitle =
    topic?.children?.[0]
      ?.children?.[0]
      ?.children?.[1]
      ?.children?.[0];

  return nestedTitle ?? getSimpleTitle(topic);
}

/**
 * Title for simple scrim items.
 */
function getSimpleTitle(topic) {
  return topic?.children?.[1]
    ?.children?.[1]
    ?.children?.[0];
}

/**
 * Set numbering only once.
 */
function setTopicTitle(title, numberToSet) {
  if (title.dataset.numbered === 'true') {
    return;
  }

  title.dataset.numbered = 'true';

  const prefix = numberToSet < 10 ? '0' : '';

  title.textContent =
    `${prefix}${numberToSet}${separator}${title.textContent}`;
}

/**
 * Observe TOC changes.
 */
function observeTocChanges() {
  const tocRoot = document.querySelector('toc-root');

  if (!tocRoot) return;

  let pending = false;

  const observer = new MutationObserver(() => {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;

      document
        .querySelectorAll('toc-group:not(.on)')
        .forEach(group => {
          setNumberedTitles(group);
        });
    });
  });

  observer.observe(tocRoot, {
    childList: true,
    subtree: true,
    attributes: true
  });
}
