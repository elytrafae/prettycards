
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

PrettyCards_plugin.events.on("PrettyCards:onPageLoad", function() {
    console.log("DROPPABLE LOAD!");
    var oldDroppable = window.$.fn.droppable;
    
    /*
    window.$.fn.droppable = function(a, b, c, d) {
        console.log("DROPPABLE CALLED!", a, b, c, d, this);
        var ret = oldDroppable(a, b, c, d).bind(this);
        return ret;
    }
    */
})


export {};