let popup = {
  localData: {},
  timeout: 3000,

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
      .on("click", "#btn-get-username", popup.handleGetTargetUsername);
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
      let content = "[" + popup.getLocalTime() + "][" + type + "] " + inputTxt;
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
};

$(document).ready(function () {
  popup.init();
});
