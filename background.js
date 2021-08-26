chrome.runtime.onMessage.addListener(function (request) {
  if (request.cmd === "shutdown" && request.tab) {
    let tab = request.tab;
    chrome.desktopCapture.chooseDesktopMedia(["screen"], tab, (streamId) => {
      //check whether the user canceled the request or not
      if (streamId && streamId.length) {
        setTimeout(() => {
          chrome.tabs.sendMessage(
            tab.id,
            { name: "stream", streamId },
            (response) => console.log(response)
          );
        }, 200);
      }
    });
  }
});
chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
  if (message.name === "download" && message.url) {
    chrome.storage.local.set({ pico_ext_screenshot: message.url }, () => {
      console.log(message.url);
      chrome.tabs.create({ url: "src/download.html" }, function () {
        senderResponse({ success: true });
      });
    });
    return true;
  }
});
