import { saveAs } from 'file-saver'
import { bnfSearch } from './bnf'
import GeoJSON from 'ol/format/GeoJSON'

import SearchGeoportail from 'ol-ext/control/SearchGeoportail'

import config from './config'
import vector from './vector'
import map from './map'
import dialog from './dialog'

console.log('config: ', config)

// Download features as GeoJSON
document.querySelector('#search .fa-download').addEventListener ('click', () => {
  const features =  vector.getSource().getFeatures();
  if (features.length) {
    const s = (new GeoJSON()).writeFeatures( features, {
        featureProjection: map.getView().getProjection(), 
        dataProjection: "EPSG:4326" 
      }
    );
    const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "bnf.geojson");
  }
});

// Options
document.querySelector('#search .fa-list-ul').addEventListener ('click', () => {
  dialog.show('<h2>Options</h2><ul><li><label>Proxy: <input class="proxy" type="text"/></label></li></ul><a class="ok">OK</a>')
  const proxy = dialog.getElement().querySelector('input.proxy')
  proxy.value = config.proxy;
  // OK
  dialog.getElement().querySelector('a.ok').addEventListener('click', () => {
    config.proxy = proxy.value;
    dialog.hide()
    console.log(config)
  })
});

// New search control on the 
const locateDlg = document.getElementById('locate');
const loc = new SearchGeoportail ({
  placeholder: 'rechercher...', 
  apiKey: config.apiKey,
  target: locateDlg.querySelector('.control')
});
loc.on('select', function(e){
  // console.log(e)
  locateDlg.style.display = 'none';
  map.getView().setCenter(e.coordinate);
  if (map.getView().getZoom()<15) map.getView().setZoom(15);
  if (e.search.name && e.search.name.length) {
    bnfSearch (e.search.city+" "+e.search.street);
  } else {
    if (e.search.names) bnfSearch (e.search.names[0]);
    else console.log(e.search);
  }
});
// Enter on control input
loc.getInputField().addEventListener('keypress', function(e) {
  if (e.keyCode === 13) {
    bnfSearch(loc.getInputField().value);
    locateDlg.style.display = 'none';
  }
});
map.addControl(loc);

// Get search on location hash
const search = decodeURIComponent(location.hash.replace(/^#/,''));
if (search) {
  locateDlg.style.display = 'none';
  bnfSearch(search);
} else {
  loc.getInputField().focus();
}

// Make a new Search
document.querySelector("#search input").addEventListener("change", function(e) {
  bnfSearch(e.target.value.trim());
});
