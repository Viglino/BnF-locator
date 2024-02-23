import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';

import Map from 'ol/Map'
import View from 'ol/View'
import Geoportail from 'ol-ext/layer/Geoportail'
import SearchGeoportail from 'ol-ext/control/SearchGeoportail'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'

import config from './config'

Geoportail.register("ADMINEXPRESS-COG-CARTO.LATEST", {"layer":"ADMINEXPRESS-COG-CARTO.LATEST","theme":"administratif","desc":"Limites administratives Express COG code officiel géographique 2023","server":"https://data.geopf.fr/wmts","bbox":[-63.3725,-21.4756,55.9259,51.3121],"format":"image/png","minZoom":6,"maxZoom":16,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":true,"style":"normal","tilematrix":"PM","title":"ADMINEXPRESS COG CARTO","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
Geoportail.register("GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40", {"layer":"GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40","theme":"cartes","desc":"Carte française en couleurs du XIXè siècle en couleurs superposable aux cartes et données modernes.","server":"https://data.geopf.fr/wmts","bbox":[-6.08889,41.1844,10.961,51.2745],"format":"image/jpeg","minZoom":6,"maxZoom":15,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"normal","tilematrix":"PM","title":"Carte de l'état-major (1820-1866)","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
Geoportail.register("ORTHOIMAGERY.ORTHOPHOTOS.1950-1965", {"layer":"ORTHOIMAGERY.ORTHOPHOTOS.1950-1965","theme":"ortho","desc":"Couverture en photographies aériennes de la France des années 50, telle qu'elle se présentait avant les grands aménagements des années 60. Cette couverture a été réalisée à partir des photographies aériennes historiques numérisées par l'IGN. Elle est disponible sur la France métropolitaine, les départements et régions d'Outre-Mer (la Guyane n'est que partiellement couverte) et les collectivités d'Outre-Mer sauf la Polynésie française. Les photographies sont orthorectifiées, c'est-à-dire corrigées des déformations dues à la prise de vue et au relief du terrain, et assemblées pour fournir une visualisation continue superposable avec le Référentiel à Grande Echelle (RGE®) ou les cartes.","server":"https://data.geopf.fr/wmts","bbox":[-67.7214,-21.4013,55.8464,51.0945],"format":"image/png","minZoom":0,"maxZoom":18,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"BDORTHOHISTORIQUE","tilematrix":"PM","title":"Photographies aériennes historiques 1950-1965","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg","https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});

// The Map
var map = new Map ({
  target: 'map',
  view: new View ({
    zoom: 6,
    center: [166326, 5992663]
  }),
  layers: [
    new Geoportail({ layer: "GEOGRAPHICALGRIDSYSTEMS.MAPS", key: config.apiKey, baseLayer: true, hidpi: false, visible: false }),
    new	Geoportail({ layer: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", baseLayer: true, hidpi: false, visible: false }),
    new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS.1950-1965', baseLayer: true, hidpi: false, visible: false }),
    new	Geoportail({ layer: "ORTHOIMAGERY.ORTHOPHOTOS", baseLayer: true, hidpi: false, visible: true }),
    new Geoportail({ layer: 'GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40', visible: false }),
    new Geoportail({ layer: 'ADMINEXPRESS-COG-CARTO.LATEST' }),
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
