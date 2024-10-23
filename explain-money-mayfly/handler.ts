export const handleCopyButtonClick = async ({prefix, isTestServer}: {prefix: string; isTestServer: boolean}) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "copy", prefix, isTestServer }, (response) => {
        console.log(response,'v')
        if (response) {
          console.log("Element found in content script", response);
        } else {
          console.log("Element not found");
        }
      });
    });
  }

  export const handleSendToSlack = ({prefix, isTestServer}: {prefix : string; isTestServer: boolean}) =>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "sendToSlack", prefix, isTestServer }, (response) => {
        if (response) {
          console.log("Element found in content script", response);
        } else {
          console.log("Element not found");
        }
      });
    });
  }

  