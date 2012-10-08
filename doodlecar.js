/**
 * Doodle Car
 * A simple experiment with some physics laws like acceleration and inertia.
 * by Leandro Linares @lean8086
 */
(function (window) {
	'use strict';

	// Fast references
	var document = window.document,
		Math = window.Math,
		// Canvas HTML Element
		canvas = document.querySelector('canvas'),
		// Context to draw into the canvas
		ctx = canvas.getContext('2d'),
		// Position into space
		x = 430,
		y = 198,
		// Size
		width = 46,
		height = 26,
		// Axis to rotate
		center = width / -2,
		middle = height / -2,
		// Rotation
		angle = 0,
		handling = 4,
		// How much does the car rotate each step/update (in radians)
		rotationStep = (handling * Math.PI / 180).toFixed(2),
		// Velocity
		speed = 0,
		step = 8,
		// Determines the left/right direction
		direction = 0,
		// Flag to determine when user applies the throttle
		throttling = false,
		// Flag to determine when user applies the brake
		braking = false,
		// Reference to resource to be rendered
		image = (function () {
			var i = new window.Image();
			i.src = 'http://leanlinares.s3-website-us-east-1.amazonaws.com/doodles/car.png';
			return i;
		}());

	// Which key was pressed
	document.addEventListener('keydown', function (event) {
		switch (event.keyCode) {
		// Throttle
		case 38:
		case 87:
			throttling = true;
			break;
		// Break
		case 40:
		case 83:
			braking = true;
			break;
		// Turn left
		case 37:
		case 65:
			direction = -1;
			break;
		// Turn right
		case 39:
		case 68:
			direction = 1;
			break;
		}
	});

	// Which key was releaed
	document.addEventListener('keyup', function (event) {
		switch (event.keyCode) {
		// Throttle
		case 38:
		case 87:
			throttling = false;
			break;
		// Break
		case 40:
		case 83:
			braking = false;
			break;
		// Turn left and turn right
		case 37:
		case 65:
		case 39:
		case 68:
			direction = 0;
			break;
		}
	});

	function draw() {
		// Clear the canvas with the DOM element size
		ctx.clearRect(0, 0, 900, 400);
		// Throttling but not at max speed yet (Physic: Acceleration)
		if (speed < 1 && throttling) { speed += 0.02; }
		// Car will move this far along
		var moveStep = speed * step;
		// Car in movement
		if (speed > 0) {
			// Moving but not throttling (Physic: Inertia or braking)
			if (!throttling) {
				speed -= (braking ? 0.03 : 0.01);
			}
			// Rotate if direction != 0
			angle += direction * (rotationStep * speed);
			// Calculate new car position
			x += Math.cos(angle) * moveStep;
			y += Math.sin(angle) * moveStep;
			//console.log(x + "-" + y);
			// Check for right to left transportation
			if (x > 900 + width) {
				x = -width;
			// Check for left to right transportation
			} else if (x < -width) {
				x = 900 + width;
			// Check for bottom to top transportation
			} else if (y > 400 + width) {
				y = -width;
			// Check for top to bottom transportation
			} else if (y < -width) {
				y = 400 + width;
			}
		}
		// Save the coordinate system
		ctx.save();
		// Position (0,0) at, for example, (250, 50)
		ctx.translate(x, y);
		// Rotate coordinate system
		ctx.rotate(angle);
		// Draw the car
		ctx.drawImage(image, center, middle);
		// Restore the coordinate system back to (0,0)
		ctx.restore();
		// Restart the rAF cicle
		window.requestAnimationFrame(draw);
	}

	/**
	 * Initialize
	 */
	window.onload = draw;

}(this));