import './js/bnf'
import vector from './js/vector'
import './js/interface'
import './js/textSelection'
import './css/bnf.css'

// Prevent page change
window.addEventListener("beforeunload", (e) => {
  if (vector.getSource().getFeatures().length) {
    const confirmationMessage = "Are you sure you want to leave";

    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }
});
