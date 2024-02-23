import Select from 'ol/interaction/Select'
import Modify from 'ol/interaction/Modify'
import Draw from 'ol/interaction/Draw'

import map from './map'
import {getStyle} from './vector'
import vector from './vector'
import record from './record';

import list from './list'

// Select interaction
const select = new Select({ 
  style: getStyle("#936", 12) 
});
map.addInteraction(select);

map.addInteraction(new Modify({ features:  select.getFeatures() }));

// Draw interaction
const draw = new Draw({
  source: vector.getSource(),
  type: "Point"
});
map.addInteraction(draw);
draw.setActive(false);

export { select }
export { draw }
