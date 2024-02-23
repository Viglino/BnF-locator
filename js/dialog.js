const dlog = document.getElementById('dialog');

export default {
  show: (info) => {
    const div = dlog.querySelector('div');
    div.innerHTML = info;
    const closeBt = document.createElement('BUTTON');
    closeBt.className = 'closeBt';
    div.appendChild(closeBt);
    closeBt.addEventListener('click', () => {
      dlog.className = '';
    });
    dlog.className = 'visible';
  },
  hide: () => {
    dlog.className = '';
  },
  getElement: () => { 
    return dlog.querySelector('div');
  }
}
