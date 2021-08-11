let popup = {
  localData: {},
  timeout: 3000,
  classUsername: "_2tbHP6ZydRpjI44J3syuqC",
  classTitle: "_eYtD2XCVieq6emjKBH3m",
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
      .on("click", "#btn-get-reddit-title", popup.handleGetRedditTitle);
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
    if (inputTxt !== "") {
      let content;
      if (type == "message") {
        content = inputTxt;
      } else {
        content = "[" + popup.getLocalTime() + "] " + inputTxt;
      }
      let message = {
        title: "Copy Success",
        content: content,
      };
      popup.showMessage(message);
      popup.copyToClipboard(content);
    } else {
      let error = {
        title: "Please enter Reddit " + $(this).text(),
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
      error.content +
      `
                <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
                >
                <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
    $(".alert-area").html(html);
  },

  showMessage: function (message) {
    $(".alert-area").html("");
    let html =
      `<div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>` +
      message.title +
      `!</strong> <br> ` +
      message.content +
      `
                <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
                >
                <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
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
      title: "Update success",
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
            let message = {
              title: "Copy Success " + target,
              content: tab_title,
            };
            popup.showMessage(message);
            popup.copyToClipboard(tab_title);
            return false;
          }
        );
      } else if (target == "username")
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
              let message = {
                title: "Copy Success " + target,
                content: username,
              };
              popup.showMessage(message);
              popup.copyToClipboard(username);
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
    });
  },
};

$(document).ready(function () {
  popup.init();
});
