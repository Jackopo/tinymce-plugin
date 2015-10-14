/*global npsOpenWindowWithReturn: false */

var npsClientEditor = (function () {
  var editState;
  var editor;
  var returnValue;
  var config = {
    basePath: "",
    imageDialogUrl: undefined,
    linkDialogUrl: undefined,
    previewPathPrefix: undefined,
    this_line_no_comma: undefined
  };

  var useRelativeUrls = false;
  var setLink = function(href, title, target) {
    alert("Function npsClientEditor.setLink has not been set up");
  };
  var setImage = function(src, alt) {
    alert("Function npsClientEditor.setImage has not been set up");
  };

  var base64;

  var createImageEditUrl = function(src, alt) {
    var url = config.imageDialogUrl;
    if (!url) {
      alert("npsClientEditor.imageDialogUrl has not been configured");
    }
    return url +
        "&base=" + encodeURIComponent(config.basePath) +
        "&src=" + encodeURIComponent(base64.encode(src)) +
        "&title=" + encodeURIComponent(base64.encode(alt)) +
        "&urp=" + (useRelativeUrls ? "true" : "false") +
        "&init=true";
  };

  var createLinkEditUrl = function(href, title, target) {
    var url = config.linkDialogUrl;
    if (!url) {
      alert("npsClientEditor.linkDialogUrl has not been configured");
    }
    return url +
        "&base=" + encodeURIComponent(config.basePath) +
        "&href=" + encodeURIComponent(base64.encode(href)) +
        "&title=" + encodeURIComponent(base64.encode(title)) +
        "&target=" + encodeURIComponent(base64.encode(target)) +
        "&init=true";
  };

  var openEditWindow = (function() {
    var linkEditWin;

    var pollResult = function() {
      if (!linkEditWin.closed) {
        setTimeout(pollResult, 500);
        return;
      }
      if (returnValue.hasResult !== true) {
        return;
      }
      var title = returnValue.title || "";
      if (editState === "NEW_IMAGE" || editState === "EDIT_IMAGE") {
        setImage(returnValue.src || "", title);
      } else if (editState === "NEW_LINK" || editState === "EDIT_LINK") {
        var anchor = returnValue.anchor || "";
        var href = returnValue.href || "";
        if (anchor.length > 0) {
          href = href + "#" + anchor;
        }
        var target = returnValue.target || "";
        setLink(href, title, target);
      }
    };

    return function(editUrl) {
      returnValue = {hasResult: false};
      linkEditWin = npsOpenWindowWithReturn(editUrl, "_blank", "s");
      pollResult();
    };
  }());

  var that = {
    config: config
  };

  that.editLink = function(e, href, title, target) {
    editor = e;
    editState = "EDIT_LINK";
    openEditWindow(createLinkEditUrl(href, title, target));
  };

  that.createLink = function(e) {
    editor = e;
    editState = "NEW_LINK";
    openEditWindow(createLinkEditUrl("", "", ""));
  };

  that.editImage = function(e, src, alt) {
    editor = e;
    editState = "EDIT_IMAGE";
    openEditWindow(createImageEditUrl(src, alt));
  };

  that.createImage = function(e) {
    editor = e;
    editState = "NEW_IMAGE";
    openEditWindow(createImageEditUrl("", ""));
  };

  that.getState = function() {
    return editState;
  };

  that.getEditor = function() {
    return editor;
  };

  that.getReturnValue = function() {
    return returnValue;
  };

  that.setup = function(property, value) {
    if (property === "useRelativeUrls") {
      useRelativeUrls = value;
    } else if (property === "setLink") {
      setLink = value;
    } else if (property === "setImage") {
      setImage = value;
    } else {
      alert("Unexpected npsClientEditor setup: " + property);
    }
  };

  that.configure = function(properties) {
    for (var p in properties) {
      if (properties.hasOwnProperty(p)) {
        if (config.hasOwnProperty(p)) {
          config[p] = properties[p];
        } else {
          alert("Unexpected npsClientEditor config: " + p);
        }
      }
    }
  };

  /**
  *
  *  Base64 encode / decode
  *  http://www.webtoolkit.info/
  *
  **/
  base64 = (function() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var utf8_encode;
    var utf8_decode;

    var encode = function(input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = utf8_encode(input);

      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
            chars.charAt(enc1) +
            chars.charAt(enc2) +
            chars.charAt(enc3) +
            chars.charAt(enc4);
      }
      return output;
    };

    var decode = function(input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {
        enc1 = chars.indexOf(input.charAt(i++));
        enc2 = chars.indexOf(input.charAt(i++));
        enc3 = chars.indexOf(input.charAt(i++));
        enc4 = chars.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      return utf8_decode(output);
    };

    utf8_encode = function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    };

    utf8_decode = function(utftext) {
      var string = "";
      var i = 0;
      var c = 0;
      var c1 = 0;
      var c2 = 0;
      var c3 = 0;

      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    };

    return {
      encode: encode,
      decode: decode
    };
  }());

  return that;
}());
