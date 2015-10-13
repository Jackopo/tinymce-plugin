tinymce.PluginManager.add('hannrelists', function(editor, url) {

  function createLinkTag(url, text) {
    return "<a href='" + url + "' class='link'>" + text + "</a>";
  }



  editor.addButton('hannrelists', {
    text: 'HR lists',
    icon: true,
    onclick: function() {

      // Open window
      editor.windowManager.open({
          title: 'Hannre Download List',
          body: [
              {type: 'textbox', name: 'link', label: 'Name'},
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
            }

            list = dom.getParent(selection.getNode(), 'ul');

            if (list) {
              dom.addClass(list, "download-link-list");
            }

            var link = createLinkTag(e.data.url, e.data.link);
            editor.insertContent(link);

            // link.removeAttribute('data-mce-href');
          }
      });
		}
	});
});