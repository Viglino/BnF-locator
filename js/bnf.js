import config from './config'
import map from './map'
import vector from './vector'
import Ajax from 'ol-ext/util/Ajax'

import {select} from './interaction'
import {draw} from './interaction'
import record from './record';

import list from './list'
import showSlide from './slide'
import dialog from './dialog';

// Search input
const input = document.querySelector('#search input');

// Delete Feature
document.addEventListener('keyup', (e) => {
  if (e.keyCode===46 && record.current.feature && !/input/i.test(document.activeElement.tagName)) {
    select.getFeatures().clear();
    vector.getSource().removeFeature(record.current.feature);
    record.current.feature = null;
    draw.setActive(true);
  };
});

/** Search request SRU
https://github.com/hackathonBnF/hackathon2016/wiki/API-SRU
*/
function bnfSearch(query) {
  var start = 1;
  // Search next page
  if (query===false) {
    query = input.value;
    start = record.next || 1;
  } else {
    input.value = query;
  }
  list.wait();
  // Load info
  let url = 'https://gallica.bnf.fr/SRU';
  let data = {
    operation: "searchRetrieve",
    version : "1.2",
    query : '(gallica all "'+query+'") and (dc.type all "image")', // not dc.type all "engraving"', // dc.type photographie ?
    //query : '(dc.source all "Musée Air France" and dc.title all "Affiche") and (dc.type all "image")', 
    suggest : 0,
    startRecord: start,
    maximumRecords: 30
  };
  if (config.proxy) {
    let parameters = '';
    for (let index in data) {
      if (data.hasOwnProperty(index) && data[index] !== undefined) {
        parameters += (parameters ? '&' : '?') + index + '=' + data[index];
      }
    }

    url = config.proxy + encodeURIComponent(url + parameters)
    data = undefined
  }
  Ajax.get ({
    url: url,
    dataType: 'xml',
    cache: true,
    options: { encode: false },
    statusCode: {
      401: function (data) {
        // alert('401: Unauthenticated');
      }
    },
    data: data,
    success: (resp) => {
      list.wait(false);
      const records = record.records = [];

      function get(node, what, all) {
        const n = node.getElementsByTagName(what);
        if (!n || !n.length) {
          console.log(what, node);
          return '';
        }
        if (all) {
          const l = [];
          for (let i=0; i<n.length; i++) {
            l.push(n[i].innerHTML);
          }
          return l.join(' - ');
        } else {
          return n[0].innerHTML;
        }
      }

      // Parse XML
      const parser = new DOMParser();
      const xml = parser.parseFromString(resp,"text/xml");
      record.max = parseInt(xml.getElementsByTagName('srw:numberOfRecords')[0].innerHTML);
      record.next = parseInt(xml.getElementsByTagName('srw:nextRecordPosition')[0].innerHTML);
      list.count(record.next-1, record.max)
      if (record.next) list.next(true);
      else list.next(false);
      // Get all records
      const rec = xml.getElementsByTagName('srw:records')[0].getElementsByTagName('srw:record');
      for (let i=0, r; r = rec[i]; i++) {
        console.log(r)
        var img = {};
        img.id = get(r, 'dc:identifier');
        img.title = get(r, 'dc:title');
        img.desc = get(r, 'dc:description', true);
        img.subject = get(r, 'dc:subject', true);
        img.coverage = get(r, 'dc:coverage', true);
        img.date = get(r, 'dc:date');
        img.right = get(r, 'dc:rights');
        img.thumb = get(r, 'thumbnail');
        img.type = get(r, 'dc:type', true);
        records.push(img);
      };
      bnfShow(record.records, start==1);
    },
    error: () => {
      list.wait(false);
      dialog.show('Service is not avaliable...');
    }
  });
};

/** Add a new line in the list
*/
function addLine(r) {
  // filter
  if (/text|portrait|estampe|engraving|plan|illustr/i.test(r.type)) return;
  // ok
  if (!r.feature) {
    var features = vector.getSource().getFeatures();
    for (var i=0, f; f=features[i]; i++) {
      if (f.get('id') == r.id) {
        r.feature = f;
        break;
      }
    }
  }
  list.addLine(r, (visible, r) => {
    if (visible) {
      record.current = r;
      showSlide(record.current);
      if (!record.current.feature) {
        draw.setActive(true);
        select.getFeatures().clear();
      } else {
        draw.setActive(false);
        select.getFeatures().clear();
        select.getFeatures().push(record.current.feature);
        map.getView().setCenter(record.current.feature.getGeometry().getCoordinates());
      }
    } else {
      record.current = {};
      draw.setActive(false);
      select.getFeatures().clear();
    }
  });
};


/** When feature is selected show associated records in the list
*/
select.on("select", (e) => {
  if (e.selected.length) {
    var sel = e.selected[0];
    let r = list.select(sel.get('id'))
    if (!r) {
      r = sel.getProperties();
      delete r["geometry"];
      addLine(r);
    }
    record.current = r;
  }
});

// A feature is added > set its attributes
vector.getSource().on('addfeature', (e) => {
  draw.setActive(false);
  record.current.feature = e.feature;
  for (let i in record.current) {
    if (i!=='feature') e.feature.set(i, record.current[i]);
  }
});

/** Show a list of the records
*/
function bnfShow(rec, clear) {
  if (clear) list.clear();
  if (!rec.length) {
    list.error();
    list.next(false);
  } else {
    for (var i=0, r; r = rec[i]; i++) {
      addLine(r)
    }
  }
};

export { bnfSearch }
