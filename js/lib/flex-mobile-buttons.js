/**
 * @author Marty Boggs / http://www.threejsworld.com
 */
function FlexMobileButtons(args) {
	this.args = args || {};
	if (!('mobileOnly' in this.args)) this.args.mobileOnly = false;
	if (!this.args.onclick) this.args.onclick = onclick;
	if (!this.args.offclick) this.args.offclick = offclick;
	if (this.args.mobileOnly)
		this.isMobile = checkMobile();
	if (!this.args.parent) this.args.parent = document.body;
	this.args.element = document.createElement('div');
	this.args.element.className = this.args.element.id = 'fmb-container';
	this.args.parent.append(this.args.element);

	this.containers = [];
	this.container = this.args.element;
	this.clicking = {};
	var self = this;

	this.args.element.addEventListener('mousedown', buttonOnClick);

	this.args.element.addEventListener('touchstart', buttonOnClick);
	document.addEventListener('touchend', buttonOffClick);

	function checkMobile() {
		return n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i);
	}

	function isButton(target) {
		return target.className.indexOf('fmb-button') !== -1;
	}

	function onclick(value) {
		self.clicking[value] = true;
	}
	function offclick(value) {
		self.clicking[value] = false;
	}

	function buttonOnClick(e) {
		e.preventDefault();
		if (e.type === 'touchstart') {
			for (var i = 0; i < e.touches.length; i += 1) {
				if (isButton(e.touches[i].target)) {
					self.args.onclick(e.touches[i].target.value);
					document.getElementById('info').innerHTML += ' touch ' + i;
				}
			}
		} else {
			document.addEventListener('mouseup', buttonOffClick);
			document.addEventListener('mouseout', buttonOffClick);
			if (isButton(e.target)) {
				self.args.onclick(e.target.value);
			}
		}
	}

	function buttonOffClick(e) {
		if (e.type === 'touchend') {
			for (var i = 0; i < e.changedTouches.length; i += 1) {
				if (isButton(e.changedTouches[i].target)) {
					self.args.offclick(e.changedTouches[i].target.value);
					document.getElementById('info').innerHTML += ' touchoff ' + i;
				}
			}
			e.touches
		} else {
			document.removeEventListener('mouseup', buttonOffClick);
			document.removeEventListener('mouseout', buttonOffClick);
			self.args.offclick(e.target.value);
		}
	}
}

FlexMobileButtons.prototype = {
	button: function (value, display, type) {
		this.clicking[value] = false;
		var button = document.createElement('button');
		button.className = 'fmb-button';
		if (value) button.value = value;
		if (display) button.innerHTML = display;
		if (!button.innerHTML && value) button.innerHTML = value;
		if (type === 'wide') button.className += ' fmb-wide';
		this.container.appendChild(button);
		return this;
	},
	row: function () {
		this.container = document.createElement('div');
		this.container.className = 'fmb-row';
		this.containers.push(this.container);
		return this;
	},
	init: function () {
		if (this.args.mobileOnly && !this.isMobile) return;
		for (var i = 0; i < this.containers.length; i += 1) {
			this.args.element.appendChild(this.containers[i]);
		}
		return this;
	}
};
