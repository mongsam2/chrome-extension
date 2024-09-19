import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [screenshot, setScreenshot] = useState(null);

  const captureScreenshot = () => {
    chrome.runtime.sendMessage(
      { message: "capture_screenshot" },
      (response) => {
        if (response && response.screenshot) {
          setScreenshot(response.screenshot);
        }
      }
    );
  };

  // 이 부분 주목!!
  // -------------------------------------------------------------------
  useEffect(() => {
    // 백그라운드 스크립트에 메시지를 보내서 탭 목록을 요청
    // background.js로 요청을 보냄: {message: "get_tabs"}
    // response는 background.js가 보낸 데이터
    chrome.runtime.sendMessage({ message: "get_tabs" }, (response) => {
      if (response && response.tabs) {
        setTabs(response.tabs);
      }
    });
  }, []);
  // -------------------------------------------------------------------
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <a href="http://localhost:5173/" target="blank">
          Go Web
        </a>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <h1>열려 있는 탭들</h1>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <a href={tab.url} target="_blank" rel="noopener noreferrer">
              {tab.title}
            </a>
          </li>
        ))}
      </ul>
      <h1>현재 탭 스크린샷</h1>
      <button onClick={captureScreenshot}>스크린샷 찍기</button>
      {screenshot && (
        <div>
          <h2>스크린샷 결과:</h2>
          <img src={screenshot} alt="탭 스크린샷" style={{ width: "100%" }} />
        </div>
      )}
    </>
  );
}

export default App;
