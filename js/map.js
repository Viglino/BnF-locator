import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';

import Map from 'ol/Map'
import View from 'ol/View'
import GeoportailLayer from 'ol-ext/layer/Geoportail'
import SearchGeoportail from 'ol-ext/control/SearchGeoportail'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'

import config from './config'

// The Map
var map = new Map ({
  target: 'map',
  view: new View ({
    zoom: 6,
    center: [166326, 5992663]
  }),
  layers: [
    new GeoportailLayer({ layer:"GEOGRAPHICALGRIDSYSTEMS.MAPS", key: config.apiKey, baseLayer: true, hidpi: false, visible: false }),
    new	GeoportailLayer({ layer:"GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", baseLayer: true, hidpi: false, visible: false }),
    new	GeoportailLayer({ layer:"ORTHOIMAGERY.ORTHOPHOTOS", baseLayer: true, hidpi: false, visible: true })
  ]
});

// Add location control on the map
var search = new SearchGeoportail({ 
  placeholder: 'adresse ou lieu-dit...', 
  apiKey: config.apiKey 
});
map.addControl(search);
search.on('select', function(e) {
  map.getView().setCenter(e.coordinate);
  if (map.getView().getZoom()<15) map.getView().setZoom(15);
});

// LayerSwitcher
map.addControl(new LayerSwitcher());

export {search};
export default map;
