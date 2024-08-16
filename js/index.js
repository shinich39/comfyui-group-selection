"use strict";

import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

const PROPERTY_KEY = "__group__";
const DOUBLE_PRESS_DELAY = 1000 * 0.3; // 0.3s

function getSelectedNodes() {
  return app.graph._nodes.filter(e => e.is_selected);
}

function getGroup(n) {
  return n?.properties?.[PROPERTY_KEY];
}

function isGroup(node, group) {
  const g = node?.properties?.[PROPERTY_KEY];
  return Array.isArray(g) && g.indexOf(group) > -1;
}

function getGroupNodes(g) {
  return app.graph._nodes.filter(n => isGroup(n, g));
}

function selectNodes(nodes) {
  app.canvas.selectNodes(nodes);
}

function deselectAll() {
  app.canvas.deselectAllNodes();
}

// bypass
function enableNodes(nodes) {
  for (const n of nodes) {
    n.mode = 0;
  }
}

function disableNodes(nodes) {
  for (const n of nodes) {
    n.mode = 4;
  }
}

function isEnabledNodes(nodes) {
  for (const n of nodes) {
    if (n.mode === 0) {
      return true;
    }
  }
  return false;
}

function toggleNodes(nodes) {
  let isEnabled = isEnabledNodes(nodes);
  if (isEnabled) {
    disableNodes(nodes);
  } else {
    enableNodes(nodes);
  }
}

;(() => {
  try {
    let prevGroup = -1, 
        prevTime = 0;

    function keydownEvent(e) {
      try {
        const { key } = e;
        const ctrlKey = e.ctrlKey || e.metaKey;

        if (e.target != document.body && e.target.id != "graph-canvas") {
          return;
        }

        if (!/^[0-9]$/.test(key)) {
          return;
        }

        if (ctrlKey) {
          e.preventDefault();
          // remove group
          const prevNodes = getGroupNodes(key);
          for (const n of prevNodes) {
            if (!n.properties[PROPERTY_KEY]) {
              n.properties[PROPERTY_KEY] = [];
            } else {
              n.properties[PROPERTY_KEY] = n.properties[PROPERTY_KEY].filter(e => e != key);
            }
          }

          // set group
          const currNodes = getSelectedNodes();
          for (const n of currNodes) {
            if (!n.properties[PROPERTY_KEY]) {
              n.properties[PROPERTY_KEY] = [key];
            } else {
              n.properties[PROPERTY_KEY].push(key);
            }
          }
        } else {
          const groupNodes = getGroupNodes(key);
          if (groupNodes.length > 0) {
            e.preventDefault();
            if (prevGroup == key && prevTime + DOUBLE_PRESS_DELAY >= Date.now()) {
              toggleNodes(groupNodes);
              prevGroup = -1;
              prevTime = 0;
            } else {
              deselectAll();
              selectNodes(groupNodes);
              prevGroup = key;
              prevTime = Date.now();
            }
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