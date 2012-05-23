(function (window) {
	"use strict";

	/*
	*  Helpers
	*/
	var document = window.document,
		Math = window.Math,
		Image = window.Image,

	/*
	*  Core
	*/
		DC = {
			"version": "0.1",
			"display": {
				"width": 900,
				"height": 500
			}
		};

	// Canvas context to draw
	DC.context = (function () {

		// Create canvas HTML element
		var canvas = document.querySelector("canvas");

		// Set canvas size
		canvas.width = DC.display.width;
		canvas.height = DC.display.height;

		// Return context
		return canvas.getContext("2d");
	}());


	DC.Car = function () {

		/*
		*  Private members
		*/
		var self = {},

			points = {
				"x": 430,
				"y": 245,
				"width": 46,
				"height": 26,
				"center": 46 / -2,
				"middle": 26 / -2
			},

			rotation = {
				"angle": 0,
				"handling": 4,
				// How much does the car rotate each step/update (in radians)
				// TODO: make the 4 variable (rotation.handling)
				"speed": 4 * Math.PI / 180
			},

			movement = {
				"speed": 0,
				"step": 8
			},

			image = (function () {

				var img = new Image();

				img.src = "http://static.leanlinares.com.ar/doodlecar/car.png";

				return img;
			}());

		/*
		*  Public members
		*/

		self.direction = 0;

		self.throttling = false;

		self.braking = false;

		// TODO: make custom event
		self.draw = function () {

			// Physic: Acceleration (throttling but not at max speed yet)
			if (movement.speed < 1 && self.throttling) { movement.speed += 0.03; }

			// Car will move this far along
			var moveStep = movement.speed * movement.step;

			// Car in movement
			if (movement.speed > 0) {
				// Physic: Inertia or braking (moving but not throttling)
				if (!self.throttling) {
					movement.speed -= (self.braking ? 0.03 : 0.01);
				}

				// Rotate if direction != 0
				rotation.angle += DC.main.direction * (rotation.speed * movement.speed);

				// Calculate new car position
				points.x = points.x + Math.cos(rotation.angle) * moveStep;
				points.y = points.y + Math.sin(rotation.angle) * moveStep;
			}

			// Save the coordinate system
			DC.context.save();

			// Position (0,0) at, for example, (250, 50)
			DC.context.translate(points.x, points.y);

			// Rotate coordinate system
			DC.context.rotate(rotation.angle);

			// Draw the car
			// TODO: may be position-center should be 0
			//DC.context.fillRect(points.center, points.middle, points.width, points.height);
			DC.context.drawImage(image, points.center, points.middle);

			// Restore the coordinate system back to (0,0)
			DC.context.restore();

		};

		return self;
	};

	// Drawing method
	DC.draw = function () {

		// Clear the canvas
		DC.context.clearRect(0, 0, DC.display.width, DC.display.height);

		// Draw main car
		DC.main.draw();
	};

	// Enter frame
	DC.init = (function () {

		// Create main car
		DC.main = DC.Car();

		// Which key was pressed
		document.addEventListener("keydown", function (event) {

			document.body.style.overflow = "hidden";

			switch (event.keyCode) {
			// Throttle
			case 38:
			case 87:
				DC.main.throttling = true;
				event.preventDefault();
				break;
			// Break
			case 40:
			case 83:
				DC.main.braking = true;
				event.preventDefault();
				break;
			// Turn left
			case 37:
			case 65:
				DC.main.direction = -1;
				event.preventDefault();
				break;
			// Turn right
			case 39:
			case 68:
				DC.main.direction = 1;
				event.preventDefault();
				break;
			}

		}, false);

		// Which key was releaed
		document.addEventListener("keyup", function (event) {

			document.body.style.overflow = "visible";

			switch (event.keyCode) {
			// Throttle
			case 38:
			case 87:
				DC.main.throttling = false;
				break;
			// Break
			case 40:
			case 83:
				DC.main.braking = false;
				break;
			// Turn left and turn right
			case 37:
			case 65:
			case 39:
			case 68:
				DC.main.direction = 0;
				break;
			}

		}, false);

		// Request Animation Frame Polyfill
		var raf = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};

		// Return tick function
		return function tick() {

			// Execute itself in Request Animation Frame
			raf(tick);

			// Execute drawing method
			DC.draw();
		};

	}());

	/*
	*  Exports
	*/
	window.doodlecar = DC;

	/*
	*  Initialize
	*/
	DC.init();

}(window));