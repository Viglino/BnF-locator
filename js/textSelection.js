import dialog from './dialog'
import {search} from './map'

let count = 0;
let mouseDown = 0;

// On selection do something
function getSelectionText() {
  --count;
  if (count || mouseDown > 0) return;
  if (/input/i.test(document.activeElement.tagName)) return;
  let text = '';
  if (window.getSelection) {
      text = window.getSelection().toString().trim();
      if (text) window.getSelection().empty();
  } else if (document.selection && document.selection.type != 'Control') {
      text = document.selection.createRange().text.trim();
      if (text) document.getSelection().removeAllRanges();
  }
  if (text) {
    const locateDlg = document.getElementById('locate');
    locateDlg.style.display = 'none';
    // New dialog
    dialog.show(text);
    dialog.show('Rechercher : "'+text+'"<br/><a>Geoportail</a><a>Wikipedia</a><a>Google</a><a>Map</a>');
    let buttons = dialog.getElement().querySelectorAll('a');
    buttons[0].onclick = (e) => {
      dialog.hide();
      search.setInput(text);
      search.search();
      search.button.click();
    };
    buttons[1].href = 'https://fr.wikipedia.org/wiki/'+encodeURI(text);
    buttons[1].target = 'Wiki';
    buttons[1].onclick = dialog.hide;
    buttons[2].href = 'https://www.google.com/search?q='+encodeURI(text);
    buttons[2].target = 'Google';
    buttons[2].onclick = dialog.hide;
    buttons[3].href = 'https://www.google.fr/maps/place/'+encodeURI(text)+'/';
    buttons[3].target = 'Maps';
    buttons[3].onclick = dialog.hide;
  }
}

let listener = null;
document.addEventListener('mousedown', () => {
  ++mouseDown;
  if (listener) clearTimeout(listener);
  listener = setTimeout(() => {
    mouseDown = 0;
  },500);
});

// CheckSelection on mouseup
document.addEventListener('mouseup', () => {
  --mouseDown;
  ++count;
  setTimeout( getSelectionText, 500 );
});
