'use strict';

document.addEventListener('DOMContentLoaded', function () {

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

});