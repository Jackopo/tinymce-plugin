
// longname: 'Hannre Lists Plugin',
// author: 'Infopark AG',
// authorurl: 'http://www.infopark.de',
// infourl: 'http://www.infopark.de',
// version: "0.2"



(function() {
  tinymce.PluginManager.add('hannrelists', function(editor, url) {
    function createList(list, editor, dom, domQuery, selection) {


      editor.execCommand('InsertUnorderedList');
      list = dom.getParent(selection.getNode(), 'ul');
      dom.addClass(list, "download-link-list");
      var item = dom.getParent(selection.getNode(), 'li');

      while (item) {
        dom.addClass(item, "item");
        var subItem = domQuery.find("strong", item);
        dom.addClass(subItem, "link");
        item = dom.getPrev(item, 'li');
      }
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
          createList(list, editor, dom, domQuery, selection);
        }

        if (list) {
          // if a list is already present
        }
    }


    editor.addButton('hannrelists', {
      text: 'HR lists',
      icon: true,
      onclick: findLists
    });
  });
}());