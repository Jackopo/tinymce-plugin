tinymce.PluginManager.add('hannrelists', function(editor, url) {

  function bindSelectorSetContent() {
    var selection = editor.selection;
    selection.setContent("Hello World!");
	}

	editor.addButton('hannrelists', {
		text: 'HR lists',
		icon: true,
		onclick: function() {

      bindSelectorSetContent();

		}
	});
});