// Set the name of the hidden property and the change event for visibility
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
	if (document[hidden]) {
	} else {
	}
}

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
	console.log("This demo requires Page Visibility API support.");
} else {
	// Handle page visibility change
	document.addEventListener(visibilityChange, handleVisibilityChange, false);
}