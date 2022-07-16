
// Will need to animate this and code a way to zoom in on a specific element.

class ZoomManager {

    constructor() {
    }

    zoomElement(xZoom, yZoom, element) {
        element.css("transform", `scale(${xZoom}, ${yZoom})`);
    }

    zoomScreen(xZoom, yZoom) {
        window.$("")
    }

}