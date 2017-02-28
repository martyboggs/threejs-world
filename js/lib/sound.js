var sound = (function () {
	'use strict';
	var callback = null;
	var pool = [];
	var playing = {};
	var index = 0;
	var sounds = {};
	sound = {
		init: function (Sounds, Callback) {
			sounds = Sounds;
			callback = Callback || function () {};
			this.keys = Object.keys(sounds);
			if (!this.keys.length) return;
			this.load_next(this.keys[index]);
		},
		load_next: function () {
			if (index < this.keys.length) {
				console.log(index, this.keys[index]);
				this.load(this.keys[index]);
			} else {
				callback();
			}
		},
		load: function (name) {
			var self = this;
			var audio = document.createElement('audio');
			audio.style.display = 'none';
			audio.autoplay = false;
			if (sounds[name].type === 'loop') {
				audio.loop = true;
			}
			sounds[name].lastFrame = false;
			audio.addEventListener('loadeddata', function () {
				sounds[name].audio = audio;
				index += 1;
				self.load_next();
			}, false);
			audio.src = '/sounds/'+ name +'.wav';
		},
		play: function (name) {
			if (sounds[name] && sounds[name].audio) {
				if (sounds[name].type === 'overlap') {
					if (sounds[name].lastFrame) return;
					sounds[name].lastFrame = true;
					setTimeout(function () {
						sounds[name].lastFrame = false;
					}, 40);
					var id = pool.length;
					pool.push(sounds[name].audio.cloneNode());
					pool[id].play();
					pool[id].onended = function () {
						pool.splice(pool.indexOf(this), 1);
						delete this;
					}
				}
				sounds[name].audio.play();
			}
		},
		stop: function (name) {
			sounds[name].audio.pause();
			sounds[name].audio.currentTime = 0;
		},
		isPlaying: function (name) {
			if (sounds[name]) {
				if (sounds[name].audio) return !sounds[name].audio.paused || sounds[name].audio.currentTime;
				else return false;
			} else {
				return false;
			}
		}
	}
	return sound;
})();