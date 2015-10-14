tinymce.PluginManager.add('hannrelists', function(editor, url) {

  editor.addButton('hannrelists', {
    text: 'HR lists',
    icon: true,
    onclick: function() {

      // Open window
      editor.windowManager.open({
          title: 'Hannre Download List',
          body: [
              {type: 'textbox', name: 'link', label: 'Link Name'},
              {type: 'textbox', name: 'url', label: 'URL'}
          ],
          onsubmit: function(e) {
            //
            var list;
            var dom = editor.dom;
            var selection = editor.selection;

            // Check for existing list element
            list = dom.getParent(selection.getNode(), 'ul');

            // Switch/add list type if needed
            if (!list) {
              editor.execCommand('InsertUnorderedList');
              list = dom.getParent(selection.getNode(), 'ul');
            }

            if (list) {
              dom.addClass(list, "download-link-list");
              item = dom.getParent(selection.getNode(), 'li');
              if (item) {
                dom.addClass(item, "item");
                editor.execCommand('mceInsertContent', false, editor.dom.createHTML('a', {
                  href: e.data.url,
                  class: "link"
                },
                  e.data.link
                ));
              }
            }
          }
      });
		}
	});
});