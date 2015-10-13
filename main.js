tinymce.init({
  selector: "#mytextarea",
  mode: "specific_textareas",
  // editor_selector: "mceEditor",
  plugins: "paste searchreplace table code anchor visualblocks hannrelists",
  dialog_type: "modal",
  entity_encoding : "raw",
  toolbar1: "bold italic underline strikethrough | hannrelists bullist numlist outdent  indent | formatselect fontselect fontsizeselect",
  toolbar2: "undo redo | searchreplace | removeformat visualblocks | anchor | table | superscript subscript | alignleft aligncenter alignright alignjustify | code",
  content_css: "css/style.css"
});