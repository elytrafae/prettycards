
import { PrettyCards_plugin, prettycards } from "./underscript_checker";

// Will need to animate this and code a way to zoom in on a specific element.

class ZoomManager {

    constructor() {
    }

    zoomElement(xZoom, yZoom, element) {
        var e = element[0];
        
        element.css("transform", `scale(${xZoom}, ${yZoom})`);
    }

    zoomScreen(xZoom, yZoom) {
        zoomElement(xZoom, yZoom, $("body"));
    }

}

var zoomManager = new ZoomManager();

prettycards.zoomManager = zoomManager;

export {zoomManager};