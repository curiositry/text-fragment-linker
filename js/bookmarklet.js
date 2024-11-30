javascript: (function() {
  
  function getSelectionText() {
    let text = "";
    const activeEl = document.activeElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
      text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
      text = window.getSelection().toString();
    }

    return text;
  }
  
  function updateTextSelector() {
    let selection = encodeURIComponent(getSelectionText());
    if (selection.length > 0) {
      let output = url + "#:~:text=" + selection //+ start + "," + end;
      // window.location = interfaceURL+"?selection="+selection+"&url="+window.location
      navigator.clipboard.writeText(output).then(() => {
        console.log('URL copied to clipboard:', output);
      });

      window.location = output
    } else {
      console.log("Selection was blank, please select some text.")
    }
  }
  //var interfaceURL = "file:///var/www/text-fragment-deeplink-bookmarklet/index.html"
  var interfaceURL = "https://curiositry.com/text-fragment-linker/"
  //<!-- var interfaceURL = "google.com" -->
  // <!-- document.onmouseup = document.onkeyup = document.onselectionchange = function() { -->
  //document.onmouseup = document.onkeyup = 
  let url = window.location
  // let url = document.getElementById("urlInput").value;
  // let start = encodeURIComponent(document.getElementById("startInput").value);
  // let end = encodeURIComponent(document.getElementById("endInput").value);
  let existingSelection = encodeURIComponent(getSelectionText());
  if (existingSelection.length < 1) {
    document.onmouseup = document.onkeyup = function() {
      updateTextSelector();
    };
  } else {
    updateTextSelector();
  }
})();
