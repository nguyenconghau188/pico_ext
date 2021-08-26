let popup = {
  localData: {},
  timeout: 3000,
  classUsername: "_2tbHP6ZydRpjI44J3syuqC",
  classTitle: "_eYtD2XCVieq6emjKBH3m",
  classVoteButton: "voteButton",
  init: function () {
    if (jQuery.isEmptyObject(popup.localData)) {
      popup.loadLocalData();
    } else {
      popup.loadLocalDataToInput();
    }
    popup.addEventListener();
  },

  addEventListener: function () {
    $(document)
      .on("click", ".btn-copy", popup.handleButtonCopy)
      .on("click", "#btn-update", popup.handleUpdateRedditInfo)
      .on("click", "#btn-get-username", popup.handleGetTargetUsername)
      .on("click", "#btn-get-reddit-username-0", popup.handleGetRedditUsername0)
      .on("click", "#btn-get-reddit-username-1", popup.handleGetRedditUsername1)
      .on("click", "#btn-get-reddit-title", popup.handleGetRedditTitle)
      .on("click", "#btn-gen-code", popup.handleGenerateCode)
      .on("click", "#btn-screenshot", popup.handleScreenShot);
  },

  loadLocalData: function () {
    let data = window.localStorage.getItem("data_reddit");
    if (data != null) {
      popup.localData = JSON.parse(data);
      popup.loadLocalDataToInput();
    } else {
      let error = {
        title: "Please enter Reddit info AND click Update button",
        content: "",
      };
      popup.showError(error);
    }
  },

  loadLocalDataToInput: function () {
    $.each(popup.localData, function (key, value) {
      let elmId = $("#input-" + key);
      elmId.val(value);
    });
  },

  handleButtonCopy: function () {
    let inputTxt = $(this).next().val();
    let type = $(this).next().attr("name");
    console.log(type);
    if (inputTxt !== "") {
      let content;
      if (type == "message") {
        content = inputTxt;
      } else {
        content = "[" + popup.getLocalTime() + "] " + inputTxt;
      }
      let message = {
        title: "Copy text successful",
        content: content,
      };
      popup.showMessage(message);
      popup.copyToClipboard(content);
    } else {
      let error = {
        title: "Please enter " + $(this).text().toLowerCase(),
        content: "",
      };
      popup.showError(error);
    }
  },

  showError: function (error) {
    $(".alert-area").html("");
    let html =
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>` +
      error.title +
      `!</strong> <br> ` +
      error.content;
    $(".alert-area").html(html);
  },

  showMessage: function (message) {
    $(".alert-area").html("");
    let html =
      `<div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>` +
      message.title +
      `!</strong> <br> ` +
      message.content;
    $(".alert-area").html(html);
  },

  hideAlert: function () {
    setTimeout(function () {
      $(".alert-area").html("");
    }, popup.timeout);
  },

  handleUpdateRedditInfo: function () {
    let data = popup.getFormData($("#frm-reddit-info"));
    popup.localData = data;
    window.localStorage.setItem("data_reddit", JSON.stringify(data));
    let message = {
      title: "Update info successful",
      content: "",
    };
    popup.showMessage(message);
  },

  getFormData: function (form) {
    var unindexed_array = form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
      indexed_array[n["name"]] = n["value"];
    });

    return indexed_array;
  },

  getLocalTime: function (e) {
    return Date.now().toString().slice(-9, -1);
  },

  copyToClipboard: function (text) {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  },

  handleGetTargetUsername: function () {
    window.localStorage.removeItem("data_reddit");
  },

  handleGetRedditUsername0: function () {
    popup.getReddit("username", 0);
  },

  handleGetRedditUsername1: function () {
    popup.getReddit("username", 1);
  },

  handleGetRedditTitle: function () {
    popup.getReddit("title", null);
  },

  getReddit: function (target, type) {
    chrome.tabs.query({ active: true }, function (tabs) {
      var tab = tabs[0];
      let withCode = $("#with-code").is(":checked");
      if (target == "title") {
        chrome.tabs.executeScript(
          tab.id,
          {
            code:
              'document.querySelector("h1.' +
              popup.classTitle +
              '").textContent',
          },
          function (result) {
            let tab_title = result[0];
            if (withCode) {
              tab_title = "[" + popup.getLocalTime() + "] " + tab_title;
            }
            let message = {
              title: "Copy " + target + " successful and reddit post upvoted",
              content: tab_title,
            };
            popup.handleCopySuccess(message, tab_title);
            return false;
          }
        );
      } else if (target == "username") {
        chrome.tabs.executeScript(
          tab.id,
          {
            code:
              'document.querySelector("a.' +
              popup.classUsername +
              '").textContent',
          },
          function (result) {
            if (result.length > 0) {
              let username = "";
              if (type == 0) {
                username = result[0];
              } else {
                username = result[0].slice(2, result[0].length);
              }
              if (withCode) {
                username = "[" + popup.getLocalTime() + "] " + username;
              }
              let message = {
                title: "Copy " + target + " successful and reddit post upvoted",
                content: username,
              };
              popup.handleCopySuccess(message, username);
              return false;
            } else {
              let error = {
                title: "Copy fail",
                content: "",
              };
              popup.showError(error);
              return false;
            }
          }
        );
      }
    });
  },

  upvoteReddit: function () {
    chrome.tabs.query({ active: true }, function (tabs) {
      var tab = tabs[0];
      chrome.tabs.executeScript(
        tab.id,
        {
          code: 'document.querySelector("._1E9mcoVn4MYnuBQSVDt1gC button").getAttribute("aria-pressed")',
        },
        function (result) {
          if (result[0] == "false") {
            chrome.tabs.executeScript(
              tab.id,
              {
                code: 'document.querySelector("._1E9mcoVn4MYnuBQSVDt1gC button").click()',
              },
              null
            );
          }
        }
      );
    });
  },

  handleCopySuccess: function (message, textCopy) {
    popup.showMessage(message);
    popup.copyToClipboard(textCopy);
    popup.upvoteReddit();
  },

  handleGenerateCode: function () {
    let content = "[" + popup.getLocalTime() + "]";
    let message = {
      title: "Copy code successful",
      content: content,
    };
    popup.showMessage(message);
    popup.copyToClipboard(content);
  },

  handleScreenShot: function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tab = tabs[0];
      chrome.runtime.sendMessage({ cmd: "shutdown", tab: tab });
    });
  },
};

$(document).ready(function () {
  popup.init();
});
