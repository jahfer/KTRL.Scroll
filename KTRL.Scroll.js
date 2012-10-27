var KTRL = KTRL || {};

KTRL.Scroll = (function() {
	"use strict";

	KTRL.Scroll = function(options) {
		// default this.settings
		this.settings = {
			speed: 10,
			listTag: 'ul'
		};

		// override default with user-defined options
		if (typeof options !== 'undefined') {
			for (var prop in options) {
				this.settings[prop] = options[prop];
			}
		}
	};

	KTRL.Scroll.prototype.onScroll = function(e, el) {

		// get scroll event
		var evt	= e || window.event;

		// get outer container
		var parent = el.parentNode;

		// calculate speed and direction of scroll
		var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta;
		var direction = delta && delta / Math.abs( delta );

		// check if at end
		if (direction < 0 && parent.offsetHeight + parent.scrollTop >= parent.scrollHeight) {
			return;
		}

		// get current margin
		var curMargin = parseInt(el.style.marginTop, 10);

		// check if node at the top of it's container
		if (curMargin >= 0 && direction > 0) {
			return;
		}
		
		// update margin
		var speedDelta = this.settings.speed * Math.abs(delta)/120;
		var newMargin = curMargin + ( direction * speedDelta );

		// only prevent default if scroll not at top or bottom
		// so we use >= (instead of just >) to catch when it's
		// at the top.
		if (newMargin >= 0) { newMargin = 0; }
		else {
			// stop page scroll
			if (evt.preventDefault) { evt.preventDefault(); }
			evt.returnValue = false;
		}

		// update node's position
		el.style.marginTop = newMargin + "px";
	};

	KTRL.Scroll.prototype.run = function(els) {
		
		// make sure we're using the right event for each browser
		var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

		// ♫ don't you forget about me... ♫
		var self = this;

		// for each node passed in...
		for (var i=0; i<els.length; i++) {
			var el = els[i];
			var parent = el.parentNode;

			// persist context of object for event listener
			var handleScroll = (function(element) {
				return function(e) {
					KTRL.Scroll.prototype.onScroll.call(self, e, element);
				};
			})(el);

			parent.style.overflowY = "hidden";
			el.style.marginTop = 0;

			// add event listeners for scrolling
			if (parent.attachEvent) {
				parent.attachEvent("on"+mousewheelevt, handleScroll);
			} else if (parent.addEventListener) {
				parent.addEventListener(mousewheelevt, handleScroll, false);
			}
		}
	};

	return KTRL.Scroll;

})();

