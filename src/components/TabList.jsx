import { useState, useEffect } from "react";

function TabList() {
  const [tabs, setTabs] = useState([]);

  // 탭 목록을 업데이트하는 함수
  const updateTabs = () => {
    chrome.tabs.query({}, (result) => {
      console.log(result);
      setTabs(result);
    });
  };

  useEffect(() => {
    // 확장 프로그램이 로드될 때 탭 목록을 가져옴
    updateTabs();

    // 백그라운드 스크립트로부터 메시지를 받아 탭 목록을 업데이트
    const handleMessage = (message) => {
      if (message.action === "update") {
        updateTabs();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div>
      <h1>Open Tabs</h1>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>{tab.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TabList;
