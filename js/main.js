---
---

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
{% if jekyll.environment == 'development' %}
	ga('create', 'UA-52138306-2', 'auto');
	ga('send', 'pageview');
{% endif %}

WebFont.load({
	google: {
		families: ['Raleway:200,400', 'Bree Serif', 'Roboto:300,700']
	}
});

setInterval(function () {
	var width = $('#canvases canvas').first().width();
	$('#canvases canvas').height(width / 2);
}, 100);

$(function () {
	$('.boxes').each(function () {
		var breakpoints = [1324, 1124, 700, 480];
		var mostSlides = 5;
		if ($(this).parent().hasClass('boxes-container')) {
			mostSlides = 3;
		}
		var slides = mostSlides;
		console.log(slides);
		var responsive = [];
		for (var i = 0; i < 4; i += 1) {
			responsive.push({breakpoint: breakpoints[i], settings: {
				slidesToShow: slides > 1 ? slides : 1
			}});
			slides -= 1;
		}
		console.log(responsive);
		$(this).slick({
			slidesToShow: mostSlides,
			slidesToScroll: 2,
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: false,
			infinite: true,
			dots: true,
			responsive: responsive
		});
	});
});

/*
		preserveDrawingBuffer: true
*/
/*
		if (saveImage === 0) {
			saveImage = 1;
			setTimeout(function () {
				saveImage = 2;
			}, 3000);
		} else if (saveImage === 2) {
			saveImage = 3;
			$(document.body).prepend('<a href="' + renderer.domElement.toDataURL() + '" download="d.png">download image</a>');
		}
	}
	var saveImage = 0;
*/
