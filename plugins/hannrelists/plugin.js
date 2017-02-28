
// longname: 'Hannre Lists Plugin',
// author: 'Infopark AG',
// authorurl: 'http://www.infopark.de',
// infourl: 'http://www.infopark.de',
// version: "0.3.1"


(function() {
  tinymce.PluginManager.add('hannrelists', function(editor, url) {

    var linkType =  {
      download: "link arrow-down",
      links: "link"
    };


    function createList(editor, dom, domQuery, elem) {
      var list, selectedNode;
      editor.execCommand('InsertUnorderedList');
      selectedNode = editor.selection.getStart();
      list = dom.getParent(selectedNode, 'ul');
      return list;
    }


    function adjustItem(item, linkTypeName, dom) {

      if (linkTypeName == "links") {
        dom.removeClass(item, 'arrow-down');
      }
      dom.addClass(item, linkType[linkTypeName]);
    }

    function convertList(list, editor, dom, domQuery, linkTypeName) {

      dom.addClass(list, "download-link-list");
      var items = domQuery.find('li', list);

      domQuery.each(items, function(index, item) {
        dom.addClass(item, "item");
        var subItem = domQuery.find("a", item);
        adjustItem(subItem, linkTypeName, dom);
        item = dom.getPrev(item, 'li');
      });
    }

    function findLists(linkTypeName, target) {
      var list;
      var dom = editor.dom;
      var selection = editor.selection;
      var domQuery = tinymce.dom.DomQuery;
      var elem = selection.getNode();

      // Check for existing list element
      list = dom.getParent(elem, 'ul');

      if (dom.is(elem, "strong")) {
        adjustItem(elem, linkTypeName, dom);
        return;
      }

      // Add ul type if needed
      if (!list) {
        list = createList(editor, dom, domQuery, elem);
      }

      if (list) {
        // if a list is already present
        convertList(list, editor, dom, domQuery, linkTypeName);
      }
    }


    editor.addButton('hannrelistsDownload', {
      text: 'HR lists - Down',
      icon: true,
      onclick: function(event) {
        findLists('download', event.target);
      }
    });

    editor.addButton('hannrelistsLinks', {
      text: 'HR lists- Links',
      icon: true,
      onclick: function(event) {
        findLists('links', event.target);
      }
    });
  });
}());
