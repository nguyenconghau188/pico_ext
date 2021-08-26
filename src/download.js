chrome.storage.local.get(["pico_ext_screenshot"], function (result) {
  if (result !== undefined) {
    let image_src = result.pico_ext_screenshot;
    let img_elm = document.getElementById("pico_ext_screenshot");
    img_elm.src = image_src;
    let filename = "screenshot_" + Date.now().toString() + ".png";
    chrome.downloads.download(
      {
        filename: filename,
        url: image_src,
      },
      (downloadId) => {
        setTimeout(function () {
          window.close();
        }, 2000);
      }
    );
  }
});
