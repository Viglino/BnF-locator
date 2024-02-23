import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import FontSymbol from 'ol-ext/style/FontSymbol'
import 'ol-ext/style/FontAwesomeDef'

import map from './map'

// Style
function getStyle (color, radius) {
  return function() {
    return [ new Style({
      image: new FontSymbol({
        glyph: "fa-camera",
        radius: radius||10,
        //form: "marker",
        fill: new Fill({	color: color||"#369" }),
        stroke: new Stroke({
          color: "#fff",
          width: 2
        })
      })
    })];
  }
};

// Layer for the bnf features
const vector = new VectorLayer({
  title: 'BnF',
  source: new VectorSource({ attributions: 'Photographies &copy; BnF' }) ,
  style: getStyle(),
});
map.addLayer(vector);

export { getStyle }
export default vector;
