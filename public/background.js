let image_url = "";

// 크롬 익스텐션 아이콘 클릭 시, 사이드바가 열리도록 설정
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // -------------------------------------------------------------------
  //background.js에 App.jsx에서 보낸 요청이 도착: {message: "get_tabs"}
  if (request.message === "get_tabs") {
    chrome.tabs.query({}, (tabs) => {
      sendResponse({ tabs }); // App.jsx로 응답을 돌려보냄: {[tab들의 정보가 들어있는 리스트]}
    });
    return true; // sendResponse가 비동기적으로 호출될 수 있음을 알림
  }
  // -------------------------------------------------------------------

  if (request.message === "capture_screenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
      sendResponse({ screenshot: image });
    });
    return true; // 비동기 응답
  }
});
