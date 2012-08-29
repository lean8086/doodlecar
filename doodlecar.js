/**
 * Doodle Car
 * A simple experiment with some physics laws like acceleration and inertia.
 * by Leandro Linares @lean8086
 */
(function (window) {
	'use strict';

	/**
	 * RequestAnimationFrame polyfill
	 * Based on pollyfill by Erik Möller with fixes from Paul Irish and Tino Zijdel
	 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	 */
	(function () {
		var lastTime = 0;

		window.requestAnimationFrame = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			function (callback) {
				var currTime = new window.Date().getTime(),
					timeToCall = window.Math.max(0, 16 - (currTime - lastTime));

				lastTime = currTime + timeToCall;

				return window.setTimeout(function () { callback(lastTime); }, timeToCall);
			};

		window.cancelAnimationFrame = window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.msCancelAnimationFrame ||
			window.oCancelAnimationFrame ||
			function (id) {
				window.clearTimeout(id);
			};
	}());

	/**
	 * Helpers
	 */
	// Fast references
	var document = window.document,
		Math = window.Math,
		// Canvas HTML Element
		canvas = document.querySelector('canvas'),
		// Context to draw into the canvas
		ctx = canvas.getContext('2d'),
		// Reference to a created car
		car;

	/**
	 * Car constructor class
	 */
	function Car() {

		/**
		 * Private members
		 */
		var self = {},

			points = {
				"x": 430,
				"y": 198,
				"width": 46,
				"height": 26,
				"center": 46 / -2,
				"middle": 26 / -2
			},

			rotation = {
				"angle": 0,
				"handling": 4,
				// How much does the car rotate each step/update (in radians)
				// TODO: make the "4" variable (rotation.handling)
				"speed": 4 * Math.PI / 180
			},

			movement = {
				"speed": 0,
				"step": 8
			},

			image = (function () {
				var i = new window.Image();
				i.src = 'http://leanlinares.s3-website-us-east-1.amazonaws.com/doodlecar/car.png';
				return i;
			}());

		/**
		 * Public members
		 */
		self.direction = 0;

		self.throttling = false;

		self.braking = false;

		self.draw = function () {
			// Throttling but not at max speed yet (Physic: Acceleration)
			if (movement.speed < 1 && self.throttling) { movement.speed += 0.03; }
			// Car will move this far along
			var moveStep = movement.speed * movement.step;
			// Car in movement
			if (movement.speed > 0) {
				// Moving but not throttling (Physic: Inertia or braking)
				if (!self.throttling) {
					movement.speed -= (self.braking ? 0.03 : 0.01);
				}
				// Rotate if direction != 0
				rotation.angle += car.direction * (rotation.speed * movement.speed);
				// Calculate new car position
				points.x = points.x + Math.cos(rotation.angle) * moveStep;
				points.y = points.y + Math.sin(rotation.angle) * moveStep;
			}
			// Save the coordinate system
			ctx.save();
			// Position (0,0) at, for example, (250, 50)
			ctx.translate(points.x, points.y);
			// Rotate coordinate system
			ctx.rotate(rotation.angle);
			// Draw the car
			// TODO: may be position-center should be 0
			//ctx.fillRect(points.center, points.middle, points.width, points.height);
			ctx.drawImage(image, points.center, points.middle);
			// Restore the coordinate system back to (0,0)
			ctx.restore();
		};

		// Expose public members
		return self;
	}

	function bindings() {
		// Which key was pressed
		document.addEventListener("keydown", function (event) {
			switch (event.keyCode) {
			// Throttle
			case 38:
			case 87:
				car.throttling = true;
				event.preventDefault();
				break;
			// Break
			case 40:
			case 83:
				car.braking = true;
				event.preventDefault();
				break;
			// Turn left
			case 37:
			case 65:
				car.direction = -1;
				event.preventDefault();
				break;
			// Turn right
			case 39:
			case 68:
				car.direction = 1;
				event.preventDefault();
				break;
			}
		});

		// Which key was releaed
		document.addEventListener("keyup", function (event) {
			switch (event.keyCode) {
			// Throttle
			case 38:
			case 87:
				car.throttling = false;
				break;
			// Break
			case 40:
			case 83:
				car.braking = false;
				break;
			// Turn left and turn right
			case 37:
			case 65:
			case 39:
			case 68:
				car.direction = 0;
				break;
			}
		});
	}

	function tick() {
		// Clear the canvas with the DOM element size
		ctx.clearRect(0, 0, 900, 400);
		// Draw the car
		car.draw();
		// Restart the rAF cicle
		window.requestAnimationFrame(tick);
	}

	/**
	 * Initialize
	 */
	window.onload = function () {
		// Create a car
		car = new Car();
		// Add listeners to the document
		bindings();
		// Start the rAF cicle
		tick();
	};

}(this));