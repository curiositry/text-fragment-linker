javascript: (function() {

function snapSelectionToWord() {
  // this function courtesy of Tim Down (author of Rangy library), creative commons licence
  var sel;

    // Check for existence of window.getSelection() and that it has a
    // modify() method. IE 9 has both selection APIs but no modify() method.
    if (window.getSelection && (sel = window.getSelection()).modify) {
        sel = window.getSelection();
        if (!sel.isCollapsed) {

            // Detect if selection is backwards
            var range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);
            var backwards = range.collapsed;
            range.detach();

            // modify() works on the focus of the selection
            var endNode = sel.focusNode, endOffset = sel.focusOffset;
            sel.collapse(sel.anchorNode, sel.anchorOffset);

            var direction = [];
            if (backwards) {
                direction = ['backward', 'forward'];
            } else {
                direction = ['forward', 'backward'];
            }

            sel.modify("move", direction[0], "character");
            sel.modify("move", direction[1], "word");
            sel.extend(endNode, endOffset);
            sel.modify("extend", direction[1], "character");
            sel.modify("extend", direction[0], "word");
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        if (textRange.text) {
            textRange.expand("word");
            // Move the end back to not include the word's trailing space(s),
            // if necessary
            while (/\s$/.test(textRange.text)) {
                textRange.moveEnd("character", -1);
            }
            textRange.select();
        }
    }
}

  
  function getSelectionText() {
    let text = "";
    const activeEl = document.activeElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
      snapSelectionToWord();
      text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
      snapSelectionToWord();
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
