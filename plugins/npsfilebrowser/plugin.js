/*global npsClientEditor: false, tinymce: false, tinymce: false */


// longname: 'Infopark File Browser Plugin',
// author: 'Infopark AG',
// authorurl: 'http://www.infopark.de',
// infourl: 'http://www.infopark.de',
// version: "1.2"

if (!npsClientEditor) {
  alert("npsClientEditor not defined. You have to include nps_client_editor_support.js.");
}


(function() {
  var tinyWrapUndo = function(editor, f) {
    editor.execCommand("mceBeginUndoLevel");
    f.call(this);
    editor.execCommand("mceEndUndoLevel");
  };

  var setLink = (function() {
    var setLinkAttrs = function(dom, element, href, title, target) {
      dom.setAttrib(element, 'href', href);
      dom.setAttrib(element, 'title', title);
      dom.setAttrib(element, 'target', target === '_self' ? '' : target);
      if (tinymce.isMSIE5) {
        element.outerHTML = element.outerHTML;
      }
    };

    var modifyLink = function(editor, state, href, title, target) {
      var dom = editor.dom;
      var element;
      if (state === "EDIT_LINK") {
        element = dom.getParent(editor.selection.getNode(), "A");
        setLinkAttrs(dom, element, href, title, target);
      } else if (state === "NEW_LINK") {
        editor.execCommand("CreateLink", false, "#mce_temp_url#", {skip_undo: 1});
        var elementArray = tinymce.grep(dom.select("a"), function(n) {
          return dom.getAttrib(n, 'href') === '#mce_temp_url#';
        });
        for (var i = 0; i < elementArray.length; i += 1) {
          element = elementArray[i];
          setLinkAttrs(dom, element, href, title, target);
        }
      }
      // Don't move caret if selection was image
      if (element && element.childNodes.length !== 1 || element.firstChild.nodeName !== 'IMG') {
        editor.focus();
        editor.selection.select(element);
        editor.selection.collapse(0);
      }
    };

    return function(href, title, target) {
      var editor = npsClientEditor.getEditor();
      var state = npsClientEditor.getState();
      tinyWrapUndo(editor, function() {
        modifyLink(editor, state, href, title, target);
      });
    };
  }());

  var setImage = (function() {
    var setImageAttrs = function(dom, element, src, alt) {
      var imagePathPrefix = npsClientEditor.config.previewPathPrefix;
      dom.setAttrib(element, 'src', imagePathPrefix + src);
      dom.setAttrib(element, 'alt', alt);
    };

    var modifyImage = function(editor, state, src, alt) {
      var dom = editor.dom;
      if (state === "EDIT_IMAGE") {
        setImageAttrs(dom, editor.selection.getNode(), src, alt);
      } else if (state === "NEW_IMAGE") {
        editor.execCommand('mceInsertContent', false, '<img id="__mce_tmp" />', {skip_undo: 1});
        setImageAttrs(dom, '__mce_tmp', src, alt);
        dom.setAttrib('__mce_tmp', 'id', '');
      }
    };

    return function(src, alt) {
      var editor = npsClientEditor.getEditor();
      var state = npsClientEditor.getState();
      tinyWrapUndo(editor, function() {
        modifyImage(editor, state, src, alt);
      });
    };
  }());

  npsClientEditor.setup("setLink", setLink);
  npsClientEditor.setup("setImage", setImage);
}());


(function() {
  tinymce.PluginManager.requireLangPack('npsfilebrowser', 'en_GB');
  tinymce.PluginManager.add("npsfilebrowser", function(ed, url) {
    ed.addCommand('mceNpsLinkBrowser', function() {
      var dom = ed.dom;
      var element = dom.getParent(ed.selection.getNode(), "A");
      if (element && element.nodeName === "A") {
        npsClientEditor.editLink(ed,
          dom.getAttrib(element, "href"),
          dom.getAttrib(element, "title"),
          dom.getAttrib(element, "target")
        );
      } else {
        npsClientEditor.createLink(ed);
      }
    });

    ed.addCommand('mceNpsImageBrowser', function() {
      var dom = ed.dom;
      var element = dom.getParent(ed.selection.getNode(), "IMG");
      if (element && element.nodeName === "IMG") {
        var alt = dom.getAttrib(element, "alt");
        var src = dom.getAttrib(element, "src");
        var previewPrefix = npsClientEditor.config.previewPathPrefix;
        if (src.substr(0, previewPrefix.length) === previewPrefix) {
          src = src.substr(previewPrefix.length);
        }
        npsClientEditor.editImage(ed, src, alt);
      } else {
        npsClientEditor.createImage(ed);
      }
    });

    ed.addButton('npsLinkBrowser', {
      title: "Insert/Edit Link",
      text: 'Insert/Edit Link',
      stateSelector: 'a',
      cmd: 'mceNpsLinkBrowser'
    });

    ed.addShortcut('ctrl+k', 'Insert/Edit Link', 'mceNpsLinkBrowser');

    ed.addButton('npsImageBrowser', {
      title: 'Insert/Edit Image',
      text: 'Insert/Edit Image',
      cmd: 'mceNpsImageBrowser'
    });
  });
}());
