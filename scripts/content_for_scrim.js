(async () => {

  // Obtain the first topic under the first toc-root
  // We assume that there is only one toc-root
  const firstTopic = getFirstTopic();
  const result = await chrome.runtime.sendMessage({
    status: 'scrimListActive'
  });
  const scrimListActive = result.scrimListActive;

  if (firstTopic && scrimListActive) {
    setNumberedTitles(firstTopic);
  }
})();

// A very concise, structural approach to obtain the first topic
function getFirstTopic() {
  let rootElem = document.querySelector('toc-root');
  return rootElem?.children[1]?.children[0];
}

const separator = " | "
// Render all topics as numbered list starting at firstTopic
function setNumberedTitles(firstTopic) {
  topicsList = firstTopic.parentElement.childNodes;

  // Type of course is either nested or a simple list of scrims
  let nestedCourse;
  if (firstTopic.tagName === 'TOC-GROUP')
    nestedCourse = true;
  else if (firstTopic.tagName === 'TOC-SCRIM-ITEM')
    nestedCourse = false;
  else
    return;

  for (let i = 0; i < topicsList.length; i++) {
    let currentTopic = topicsList[i];
    let title;
    if (nestedCourse)
      title = getNestedTitle(currentTopic);
    else
      title = getSimpleTitle(currentTopic);
    // Set the title for either type of course
    if (title)
      setTopicTitle(title, i+1);
  }

  // Getting the title also relies on the structure of the page
  // The title is within a span element
  function getNestedTitle(topic) {
    let nestedTitle = topic?.children[0]?.children[0]?.children[1]?.children[0];
    if (nestedTitle === undefined)
      nestedTitle = getSimpleTitle(topic);
    return nestedTitle;
  }
  // The title is within a div element
  function getSimpleTitle(topic) {
    return topic?.children[1]?.children[1]?.children[0];
  }

  // The same approach is applicable to both types of title
  function setTopicTitle(title, numberToSet) {
    let originalTitle = title.textContent;
    let newTitle = '';
    if(numberToSet < 10)
      newTitle = '0';
    newTitle += numberToSet + separator + originalTitle;
    title.textContent = newTitle;
  }
}
