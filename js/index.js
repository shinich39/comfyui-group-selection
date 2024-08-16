"use strict";

import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

function getSelectedNodes() {
  return app.graph._nodes.filter(e => e.is_selected);
}

function getGroup(n) {
  return n?.properties?.groupSelection;
}

function getGroupNodes(g) {
  return app.graph._nodes.filter(e => getGroup(e) == g);
}

function selectNodes(nodes) {
  app.canvas.selectNodes(nodes);
}

function deselectAll() {
  app.canvas.deselectAllNodes();
}

;(() => {
  try {
    function keydownEvent(e) {
      try {
        const { key } = e;
        const ctrlKey = e.ctrlKey || e.metaKey;

        if (!/^[0-9]$/.test(key)) {
          return;
        }

        if (ctrlKey) {
          e.preventDefault();
          // remove group
          const prevNodes = getGroupNodes(key);
          for (const n of prevNodes) {
            delete n.properties.groupSelection;
          }

          // set group
          const currNodes = getSelectedNodes();
          for (const n of currNodes) {
            n.properties.groupSelection = parseInt(key);
          }
        } else {
          const groupNodes = getGroupNodes(key);
          if (groupNodes.length > 0) {
            e.preventDefault();
            deselectAll();
            selectNodes(groupNodes);
          }
        }
      } catch(err) {
        console.error(err);
      } 
    }
  
    window.addEventListener("keydown", keydownEvent, true);
  } catch(err) {
    console.error(err);
  }
})();

app.registerExtension({
	name: `shinich39.GroupSelection`,
});