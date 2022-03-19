
import { PrettyCards_plugin } from "./underscript_checker";
import $ from "/src/third_party/jquery-3.6.0.min.js";

// Code from stackoverflow: https://stackoverflow.com/questions/15191058/css-rotation-cross-browser-with-jquery-animate
$.fn.animateRotate = function(startAngle, endAngle, duration, easing, step, complete){
	const _step = step || $.noop;
    return this.each(function(){
        var elem = $(this);

        $({deg: startAngle}).animate({deg: endAngle}, {
            duration: duration,
            easing: easing,
            step: function(now){
                elem.css({
                  '-moz-transform':'rotateY('+now+'deg)',
                  '-webkit-transform':'rotateY('+now+'deg)',
                  '-o-transform':'rotateY('+now+'deg)',
                  '-ms-transform':'rotateY('+now+'deg)',
                  'transform':'rotateY('+now+'deg)'
                });
				_step(now);
            },
            complete: complete || $.noop
        });
    });
};

/*
function wrapFunction(original, n) {
    return function() {
        original(...arguments);
        n(...arguments);
    }
}

const customPropStart = "_custom_";

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    var oldDraggable = window.$.fn.draggable;

    window.$.fn.draggable = function(a, b, c, d) {
        console.log("DRAGGABLE CALLED!", a, b, c, d, this);
        if ( a != "option" || (a == "option" && (c == null || c == undefined)) || (typeof a === 'object' && a !== null)) {
            return oldDraggable.call(this, a, b, c, d);
        }

        var data = a;
        if (a == "option") {
            data = {[b]: c};
        }
        // Modify the input data somehow here!
        for (var key in data) {
            if (key.startsWith(customPropStart)) {
                var originalName = key.substring(customPropStart.length);
                data[originalName] = wrapFunction(data[originalName] || oldDraggable.call(this, "option", originalName) || function() {}, data[key]);
            }
        }
        console.log("MODIFIED DATA", data);
        return oldDraggable.call(this, data);
    }
})
*/


export {};