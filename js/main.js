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
	$('.boxes').slick({
		slidesToShow: 5,
		slidesToScroll: 2,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: false,
		infinite: true,
		dots: true,
		responsive: [
			{
				breakpoint: 1324,
				settings: {
					slidesToShow: 4
				}
			},
			{
				breakpoint: 1124,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 700,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
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
