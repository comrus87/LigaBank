'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var introPage = document.querySelector('.intro');

  if (introPage) {
    var sliderIntro = new Swiper('.intro', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      autoplay: {
        delay: 4000,
      },
      speed: 700
    });

    sliderIntro.init();
  }
});
