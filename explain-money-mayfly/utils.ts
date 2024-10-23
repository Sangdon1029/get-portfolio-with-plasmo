require('dotenv').config();
const slackEndPoint = process.env.SLACK_ENDPOINT;

export const copyToClipboard = ({text, callback} : {text: string; callback : ({ props }: {props : any}) => void}) => {
    navigator.clipboard.writeText(text).then(() => {
        callback({props: {message: "복사되었습니다."}});
    }).catch(()=> {
        callback({props: {message: "복사에 실패했습니다."}});
    });
  };


export const detectHost = (url: string) => {
    return url.includes("imweb") ? "production" : "development";
  };
  

  export const sendMessageToSlackWithFile = async ({message, channelValue, loggerName, fileUrl} : { message: unknown; channelValue? : string, loggerName?: string; fileUrl : string}) => {
    const payload = {
        text: message,
        channel: channelValue,
        username: loggerName,
    };
	
    await fetch(slackEndPoint, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(() => {
      console.log("Message sent to Slack: ", message);
      alert("메세지를 보냈습니다.");
    }).catch((error) => {
      console.error("Error sending message to Slack: ", error);
    });
  };

  