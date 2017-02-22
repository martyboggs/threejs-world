var sound = (function () {
	'use strict';
	var urls = ['climb', 'drag', 'flap', 'hit', 'jump'];
	var snd = [];
	var callback = null;
	var pool = [];
	var playing = {};
	sound = {
		init: function (Callback) {
			callback = Callback || function () {};
			this.load(urls[0]);
		},
		load_next: function () {
			urls.shift();
			if (urls.length === 0) callback();
			else sound.load(urls[0]);
		},
		load: function (name) {
			var audio = document.createElement('audio');
			audio.style.display = 'none';
			audio.src = '/sounds/'+ name +'.wav';
			audio.autoplay = false;
			audio.loop = true;
			audio.addEventListener('loadeddata', function () {
				snd[name] = audio;
				sound.load_next();
			}, false);
		},
		play: function (name) {
			if (snd[name]) {
				snd[name].play();
				// var id = pool.length;
				// pool.push(snd[name].cloneNode());
				// pool[id].play();
				// pool[id].onended = function () {
				// 	pool.splice(pool.indexOf(this), 1);
				// 	delete this;
				// }
			}
		},
		stop: function (name) {
			if (snd[name]) {
				snd[name].pause();
				snd[name].currentTime = 0;
			}
		},
		isPlaying: function (name) {
			if (snd[name]) return !snd[name].paused || snd[name].currentTime;
			else return false;
		}
	}
	return sound;
})();