chrome.runtime.onInstalled.addListener(() => {
  // 크롬 익스텐션 설치 시, 소개 페이지 탭 생성
  chrome.tabs.create({ url: "landing.html" });
});

// 크롬 익스텐션 아이콘 클릭 시, 사이드바가 열리도록 설정
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.runtime.sendMessage({ action: "update" });
});

chrome.tabs.onCreated.addListener(() => {
  chrome.runtime.sendMessage({ action: "update" });
});

chrome.tabs.onRemoved.addListener(() => {
  chrome.runtime.sendMessage({ action: "update" });
});

function extractHtml() {
  const tagsToExtract = ["title", "h1", "h2", "h3", "p", "ul", "ol", "li"];
  let extractedContent = "";
  tagsToExtract.forEach((tag) => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((element) => {
      if (tag === "a") {
        extractedContent += `Link: ${element.href} \n`;
      } else {
        extractedContent += `${tag.toUpperCase()}: ${element.innerText.trim()} \n`;
      }
    });
  });

  return extractedContent;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "scripting") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const current_tab = tabs[0];
      if (current_tab) {
        chrome.scripting.executeScript(
          {
            target: { tabId: current_tab.id },
            function: extractHtml,
          },
          (result) => {
            if (result) {
              sendResponse({ content: result[0].result });
            }
          }
        );
      }
    });
    return true;
  }
});
