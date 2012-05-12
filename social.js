(function (document) {
	"use strict";

	function createButton(o) {

		if (document.getElementById(o.id)) { return; }

		var js = document.createElement("script"),
			fjs = document.getElementsByTagName("script")[0];

		js.id = o.id;
		js.src = o.src;
		js.async = true;

		fjs.parentNode.insertBefore(js, fjs);
	}

	var buttons = [
		{
			"id": "twitter-wjs",
			"src": "//platform.twitter.com/widgets.js"
		},
		{
			"id": "facebook-jssdk",
			"src": "//connect.facebook.net/en_US/all.js#xfbml=1"
		},
		{
			"id": "plusone",
			"src": "https://apis.google.com/js/plusone.js"
		}
	];

	buttons.forEach(function (btn) {
		createButton(btn);
	});
}(document));