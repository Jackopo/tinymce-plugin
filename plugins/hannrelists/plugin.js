
// longname: 'Hannre Lists Plugin',
// author: 'Infopark AG',
// authorurl: 'http://www.infopark.de',
// infourl: 'http://www.infopark.de',
// version: "0.2"



(function() {
  tinymce.PluginManager.add('hannrelists', function(editor, url) {
    function createList(editor, dom, selection) {

      editor.execCommand('InsertUnorderedList');
      return dom.getParent(selection.getNode(), 'ul');
    }

    function convertList(list, editor, dom, domQuery, selection) {

      dom.addClass(list, "download-link-list");
      var items = domQuery.find('li', list);

      domQuery.each(items, function(index, item) {
        dom.addClass(item, "item");
        var subItem = domQuery.find("strong", item);
        dom.addClass(subItem, "link");
        item = dom.getPrev(item, 'li');
      });
    }

    function findLists() {
        var list;
        var dom = editor.dom;
        var selection = editor.selection;
        var domQuery = tinymce.dom.DomQuery;

        // Check for existing list element
        list = dom.getParent(selection.getNode(), 'ul');

        // Add ul type if needed
        if (!list) {
          list = createList(editor, dom, selection);
        }

        if (list) {
          // if a list is already present
          convertList(list, editor, dom, domQuery, selection);
        }
    }


    editor.addButton('hannrelists', {
      text: 'HR lists',
      icon: true,
      onclick: findLists
    });
  });
}());