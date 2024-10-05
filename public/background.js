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
  const bodyText = document.body ? document.body.innerText : "";
  const title = document.title || "";
  const headings = Array.from(document.querySelectorAll("h1, h2"))
    .map((h) => h.innerText)
    .join("\n");
  return {
    title,
    headings,
    bodyText,
  };
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
