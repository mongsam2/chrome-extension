chrome.runtime.onInstalled.addListener(() => {
  // 우클릭 시, 나오는 항목에 "Open Side Bar" 추가
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open Side Bar",
    contexts: ["all"],
  });
  // 우클릭 시, 나오는 항목에 "Open Full Page" 추가
  chrome.contextMenus.create({
    id: "openFullPage",
    title: "Open Full Page",
    contexts: ["all"],
  });
  // 크롬 익스텐션 설치 시, 소개 페이지 탭 생성
  chrome.tabs.create({ url: "landing.html" });
});

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
});
