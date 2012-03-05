// Create namespace
var dr = {
	"display": {
		"width": 900,
		"height": 500
	}
};

// Canvas context to draw
dr.context = (function () {
	
	// Create canvas HTML element
	var canvas = document.querySelector("canvas");
	
	// Set canvas size
	canvas.width = dr.display.width;
	canvas.height = dr.display.height;
	
	// Return context
	return canvas.getContext("2d");
	
}());


dr.Car = function () {
	
	var that = {};
	
	that.direction = 0;
	
	that.throttling = false;
	
	that.braking = false;
	
	var image = (function () {
		
		var img = new Image();
		
		img.src = "doodlecar.png";
		
		return img;
		
	}());
	
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
		};
		
		
	// TODO: make custom event
	that.draw = function () {
		
		// Physic: Acceleration (throttling but not at max speed yet)
		if (movement.speed < 1 && that.throttling) { movement.speed += 0.03; }
		
		// Car will move this far along
		var moveStep = movement.speed * movement.step;
		
		// Car in movement
		if (movement.speed > 0) {
			// Physic: Inertia or braking (moving but not throttling)
			if (!that.throttling) {
				movement.speed -= (that.braking ? 0.03 : 0.01)
			}
			
			// Rotate if direction != 0
			rotation.angle += dr.main.direction * (rotation.speed * movement.speed);
			
			// Calculate new car position
			points.x = points.x + Math.cos(rotation.angle) * moveStep;
			points.y = points.y + Math.sin(rotation.angle) * moveStep;
		}
		
		// Save the coordinate system
		dr.context.save();
		
		// Position (0,0) at, for example, (250, 50)
		dr.context.translate(points.x, points.y);
		
		// Rotate coordinate system
		dr.context.rotate(rotation.angle);
		
		// Draw the car
		// TODO: may be position-center should be 0
		//dr.context.fillRect(points.center, points.middle, points.width, points.height);
		dr.context.drawImage(image, points.center, points.middle)
		
		// Restore the coordinate system back to (0,0)
		dr.context.restore();
		
	};
	
	return that;

};

// Drawing method
dr.draw = function () {
	
	// Clear the canvas
	dr.context.clearRect(0, 0, dr.display.width, dr.display.height);
	
	// Draw main car
	dr.main.draw();
	
};

// Enter frame
dr.init = (function () {
	
	// Create main car
	dr.main = dr.Car();
	
	// Which key was pressed
	document.addEventListener("keydown", function (event) {
		
		document.body.style.overflow = "hidden";
		
		switch (event.keyCode) {
		// Throttle
		case 38: case 87:
			dr.main.throttling = true;
			event.preventDefault();
			break;
		// Break
		case 40: case 83:
			dr.main.braking = true;
			event.preventDefault();
			break;
		// Turn left
		case 37: case 65:
			dr.main.direction = -1;
			event.preventDefault();
			break;
		// Turn right
		case 39: case 68:
			dr.main.direction = 1;
			event.preventDefault();
			break;
		}
		
	}, false);
	
	// Which key was releaed
	document.addEventListener("keyup", function (event) {
		
		document.body.style.overflow = "visible";
		
		switch (event.keyCode) {
		// Throttle
		case 38: case 87: dr.main.throttling = false; break;
		// Break
		case 40: case 83: dr.main.braking = false; break;
		// Turn left and turn right
		case 37: case 65: case 39: case 68: dr.main.direction = 0; break;
		}
		
	}, false);
	
	// Request Animation Frame Polyfill
	var raf = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function (callback) {
			setTimeout(callback, 1000 / 60);
		};
	
	// Return tick function
	return function () {
		
		// Execute itself in Request Animation Frame
		raf(arguments.callee);
		
		// Execute drawing method
		dr.draw();
	};

}());

// Initialize the game (launch tick function)
dr.init();


// Tweet
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

// Like
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// +1
(function() {
	var po = document.createElement('script'); po.async = true;
	po.src = 'https://apis.google.com/js/plusone.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();