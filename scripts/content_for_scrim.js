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
 * Embed the logo and copy text just below any first topic.
 */
function embedCopyButton(firstTopic) {
  if (!firstTopic || firstTopic.dataset.embeddedCopyButton == 'true') return;

  firstTopic.dataset.embeddedCopyButton = 'true';
  // Create container
  const container = document.createElement('div');
  container.classList.add('scrimlist-logo-container');

  // Style container for a compact and unobtrusive look
  container.style.display = 'inline-flex';
  container.style.alignItems = 'center';
  container.style.gap = '6px';
  container.style.cursor = 'pointer';
  container.style.userSelect = 'none';
  container.style.margin = '3px 0 0px 31px';
  container.style.fontSize = '11px';
  container.style.color = '#888';
  container.style.width = 'fit-content';

  // Image (Logo)
  const img = document.createElement('img')
  img.src = chrome.runtime.getURL('icons/icon_128.png');
  img.alt = 'ScrimList Logo';

  // Compact size matching typical op.icon size
  const iconSize = '13px';
  img.style.width = iconSize;
  img.style.height = iconSize;
  img.style.display = 'block';
  img.style.borderRadius = '1.5px';

  // Text to the right
  const textSpan = document.createElement('span');
  textSpan.classList.add('scrimlist-copy-text');
  textSpan.style.cursor = 'pointer';
  textSpan.style.marginLeft = '7px';
  textSpan.textContent = 'Copy Topics list';
  textSpan.style.transition = 'color 0.2s';

  container.appendChild(img);
  container.appendChild(textSpan);
  let itemType = "GROUP";
  if (firstTopic.tagName === "TOC-SCRIM-ITEM") {
    itemType = "SCRIM";
  }

  // Click handler to copy content
  container.addEventListener('click', async (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    try {
      const content = getTopicsTextList(firstTopic);
      if (content) {
        await navigator.clipboard.writeText(content);
        const originalText = textSpan.textContent;
        textSpan.textContent = 'Copied!';
        textSpan.style.color = '#4caf50'; // Green
        setTimeout(() => {
          textSpan.textContent = originalText;
          textSpan.style.color = '#888';
        }, 1500);
      } else {
        textSpan.textContent = 'No topics found';
        setTimeout(() => {
          textSpan.textContent = 'Copy Topics List';
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      textSpan.textContent = 'Error copying';
      setTimeout(() => {
        textSpan.textContent = 'Copy Topics List';
      }, 1500);
    }
  });

  // Hover effects
  container.addEventListener('mouseenter', () => {
    textSpan.style.color = '#fff';
    img.style.filter = 'brightness(1.2)';
  });
  container.addEventListener('mouseleave', () => {
    textSpan.style.color = '#888';
    img.style.filter = 'none';
  });

  let itemEl = firstTopic.querySelector('toc-item-head');
  if (itemType === "SCRIM") {
    const itemHead = firstTopic.querySelector('toc-item-head');
    itemHead.appendChild(container);
  } else {
    itemEl.parentElement.appendChild(container);
  }
}

/**
 * Get the full text list of all numbered topics given firstTopic.
 */
function getTopicsTextList(firstTopic) {
  if (!firstTopic) return '';

  const tagName = firstTopic.tagName;
  const nestedCourse = tagName === 'TOC-GROUP';

  const topicsList = [...firstTopic.parentElement.children].filter(
    node =>
      node.tagName === 'TOC-GROUP' ||
      node.tagName === 'TOC-SCRIM-ITEM'
  );

  return topicsList
    .map((topic, index) => {
      const title = nestedCourse
        ? getNestedTitle(topic)
        : getSimpleTitle(topic);

      if (title) {
        return title.textContent.trim();
      }
      return '';
    })
    .filter(text => text !== '')
    .join('\n');
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

    if (index === 0) {
      embedCopyButton(currentTopic);
    }

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

// Returns the first scrim item in the toc group if one exists.
function getFirstScrim(tocGroup) {
  return tocGroup?.children?.[1]?.children?.[2]?.children?.[1];
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
        .querySelectorAll('toc-group')
        .forEach(group => {
          setNumberedTitles(group);
          let scrim = getFirstScrim(group);
          if (scrim) {
            setNumberedTitles(scrim);
          }
        });
    });
  });

  observer.observe(tocRoot, {
    childList: true,
    subtree: true,
    attributes: true
  });
}
