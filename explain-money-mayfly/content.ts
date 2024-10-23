import type { PlasmoCSConfig } from "plasmo"
 
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "copy" || message.action === "sendToSlack") {
    const element = document.getElementById('portfolioModal');
    if (element) {
      // 요소의 dataset에서 필요한 data-* 속성들을 추출
      const isTest = message.isTestServer;  
      const dataCode = element.dataset.code;  
      const dataExpertName = element?.dataset?.expertname;  
      const dataUrl = `${message.prefix}/${element.dataset.url}`;    
      const dataTitle = element.dataset.title;  
      const dataDomain = element.dataset.domain;
      const portfolioHost = isTest ? "https://imtest.me" : "https://imweb.me";
      const portfolioLink = `${portfolioHost}/expert/portfolio-detail/${dataCode}`;  
      const elementData = {
        code: dataCode,
        url: dataUrl,
        title: dataTitle,
        domain: dataDomain,
        expertName: dataExpertName,
        portfolioLink: portfolioLink
      };
      chrome.runtime.sendMessage({action: message.action, data: elementData});
    } else {
      console.log("Element with ID 'portfolioModal' not found.");
      chrome.runtime.sendMessage({action: "updateElementData", data: 'Element not found'});
    }
  }
});
