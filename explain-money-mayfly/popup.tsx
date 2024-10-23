import { useState, useEffect, useCallback } from "react";
import { handleCopyButtonClick, handleSendToSlack } from "~handler";
import { copyToClipboard, detectHost, sendMessageToSlackWithFile } from "~utils";

const defaultChannel = "#log-sangdon";

function IndexPopup() {
  const [channelValue, setChannelValue] = useState(defaultChannel);
  const [loggerName, setLoggerName] = useState("test");

  const [result, setResult] = useState("포트폴리오를 선택해주세요");
  const [isTestServer, setIsTestServer] = useState(false);
  const prefix = isTestServer ? "https://cdn-test.imtest.me" : "https://cdn-optimized.imweb.me";
  
  const getCurrentTab = useCallback(() => {
    const callBack = (tabs) =>{
      const tab = tabs[0];
      if (tab.url) {
        setIsTestServer(detectHost(new URL(tab.url).hostname) === "development");
        return 
      }
      console.log('tab.url is not exist');
    }
    const queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions,callBack);
  },[ chrome.tabs ]);
  
  

  useEffect(() => {
    const messageListener = (message) => {
      if (message.data?.title === undefined) {
        setResult("포트폴리오를 선택해주세요");
        alert("포트폴리오를 선택해주세요");
        return;
      }
      // "New Paid Time Off request from <example.com|Fred Enriquez>\n\n<https://example.com|View request>"
      const markdownText = `
        ${message.data.title}\n
      • ${message.data.expertName}\n
      • ${message.data.domain}\n
      • <${message.data.portfolioLink}|${message.data.code}>\n
      <${message.data.url}|Download Image>
      `.trim();
  
      if (message.action === "copy") {
        copyToClipboard({ text: markdownText, callback: ({props}) => setResult(props.message) });
      } else if (message.action === "sendToSlack") {
        sendMessageToSlackWithFile({message: markdownText, channelValue, loggerName, fileUrl: message.data.url});
      }
    };
  
    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []); 

  useEffect(
    ()=> getCurrentTab(),
    [ getCurrentTab ],
  );

  const onChangeChannel = (e) => {
    setChannelValue(e.target.value);
  }

  const onChangeLoggerName = (e) => {
    setLoggerName(e.target.value);
  }

  return (
    <div style={{ display:"flex", flexDirection: "column", gap: "20px", width: "300px",  padding: 16 }}>
      <button onClick={() => handleCopyButtonClick({ prefix, isTestServer })}>포트폴리오 복사하기</button>
      <input onChange={onChangeChannel} type="text" value={channelValue} placeholder="#채널 이름을 입력해주세요"/>
      <input onChange={onChangeLoggerName} type="text" value={loggerName} placeholder="로거 이름을 입력해 주세요" />
      <button onClick={() => handleSendToSlack({ prefix, isTestServer })}>슬랙으로 보내기</button>
      <div className="text" id="result">{result}</div>
    </div>
  );
}

export default IndexPopup;
