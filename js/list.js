import element from 'ol-ext/util/element'
import { bnfSearch } from './bnf'

const bnf = document.getElementById('bnf');
const ul = bnf.querySelector('ul');

// Next button
bnf.querySelector('.next').addEventListener('click', () => {
  bnfSearch (false);
});

// List container
const container = {
  /** show wait */
  wait: (b) => {
    bnf.className = (b!==false ? 'waiting' : '')
  },
  /** display counter */
  count: (c, max) => {
    bnf.querySelector('.count').innerHTML = c+'/'+max;
  },
  /** Show next button */
  next: (b) => {
    bnf.querySelector('.next').style = (b!==false ? '': 'none');
  },
  /** Clear List */
  clear: () => {
    ul.innerHTML = '';
  },
  /** show error */
  error: () => {
    element.create('LI', {
      html: 'aucune concordance...',
      className: 'error',
      parent: ul,
    });
  },
  /** Add a new line */
  addLine: (r, onclick) => {
    const li = element.create('LI', {
      parent: ul,
      click: () => {
        if (li.className === 'visible') {
          li.className = '';
        } else {
          var sel = ul.querySelector('.visible');
          if (sel) sel.className = '';
          li.className = 'visible';
        }
        onclick(li.className === 'visible', r);
      }
    });
    li['data-record'] = r;
    element.create('IMG', {
      src: r.thumb,
      parent: li
    });
    element.create('P', {
      html: r.title,
      parent: li
    });
    element.create('P', {
      html: r.desc,
      parent: li
    });
  },
  /** Select a line */
  select: (id) => {
    let record = null;
    ul.querySelectorAll('li').forEach((li) => {
      if (li['data-record'].id===id) {
        record = li['data-record'];
        // console.log('found')
        var sel = ul.querySelector('.visible');
        if (sel) sel.className = '';
        li.className = 'visible';
        ul.scrollTop = li.offsetTop - (ul.getBoundingClientRect().height - li.getBoundingClientRect().height) / 2;
      }
    });
    return record;
  }
};

export default container
