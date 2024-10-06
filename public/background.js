// 크롬 익스텐션이 설치 되었을 때 실행되는 부분
chrome.runtime.onInstalled.addListener(() => {
  // 크롬 익스텐션 설치 시, 소개 페이지 탭 생성
  chrome.tabs.create({ url: "landing.html" });
});

// 크롬 익스텐션 아이콘 클릭 시, 실행되는 부분
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId }); // 사이드바 열기
  //-------------------------------------------------------------------------------------------
  // TODO:
  // 확장 프로그램 아이콘을 누르면 새 윈도우를 열고 그 "윈도우의 정보"를 저장해주세요!
  // 새로 만든 윈도우에서 landing.html 탭과 chat gpt탭을 열어주세요!

  // 여기에 작성해주세요!

  //-------------------------------------------------------------------------------------------
});

//-------------------------------------------------------------------------------------------
// TODO:
// 만약 열어놨던 chat gpt 탭이나 landing.html 탭이 닫히면 사이드 패널도 닫히도록 해주세요!
// 저장해 놨던 "윈도우 정보"를 사용해야 될 것 같습니다.
// 아래 함수를 참고하면 될 것 같아요!
chrome.windows.onRemoved.addListener();
chrome.tabs.onRemoved.addListener();
//-------------------------------------------------------------------------------------------

// 현재 탭 상황에서 변화가 생기면 바로 반영해서 TabList 업데이트
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.runtime.sendMessage({ action: "update" });
});

chrome.tabs.onCreated.addListener(() => {
  chrome.runtime.sendMessage({ action: "update" });
});

chrome.tabs.onRemoved.addListener(() => {
  chrome.runtime.sendMessage({ action: "update" });
});

// 웹 페이지에서 필요한 html 태그만 추출하는 함수
function extractHtml() {
  let extractedContent = "";
  const elements = document.querySelectorAll("title, h1, h2, p, li");
  const contentArray = Array.from(elements).map((el) => el.innerText);
  const finalContent = contentArray.join("\n");

  return finalContent;
}

// 익스텐션 실행 중에 들어오는 모든 요청을 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 웹 페이지 요약 요청 처리
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
    //
  } else if (request.action == "summarizing") {
    const content = request.content; // 추출한 코드가 들어있는 문자열입니다!
  }
});
