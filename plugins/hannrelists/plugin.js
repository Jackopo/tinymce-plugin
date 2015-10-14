tinymce.PluginManager.add('hannrelists', function(editor, url) {

  editor.addButton('hannrelists', {
    text: 'HR lists',
    icon: true,
    onclick: function() {

      var list;
      var dom = editor.dom;
      var selection = editor.selection;
      var domQuery = tinymce.dom.DomQuery;

      // Check for existing list element
      list = dom.getParent(selection.getNode(), 'ul');

      // Switch/add list type if needed
      if (!list) {
        editor.execCommand('InsertUnorderedList');
        list = dom.getParent(selection.getNode(), 'ul');
        dom.addClass(list, "download-link-list");
        var item = dom.getParent(selection.getNode(), 'li');

        while (item) {
          dom.addClass(item, "item");
          var subItem = domQuery.find("a", item);
          dom.addClass(subItem, "link");
          item = dom.getPrev(item, 'li');
        }
      }

      if (list) {
        // add items to a list
      }
    }
  });
});