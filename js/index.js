(function() {
  
  var gradients = ["linear-gradient(to bottom, red 0%, orange 100%) fixed",
                   "linear-gradient(to bottom, blue 0%, white 100%) fixed",
                   "linear-gradient(to bottom, blue 0%, white 100%) fixed"];

  var currentIndex = 0;


  var slideContainer = $('.slide-container');
  
  slideContainer.slick();
  
  $('.clash-card__image img').hide();
  $('.slick-active').find('.clash-card img').fadeIn(200);
  
  // On before slide change
  slideContainer.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    $('.slick-active').find('.clash-card img').fadeOut(1000);

  });
  
  // On after slide change
  slideContainer.on('afterChange', function(event, slick, currentSlide) {
    $('.slick-active').find('.clash-card img').fadeIn(200);
    $("body").css("background", gradients[currentIndex++%gradients.length]);   
  });
  
})();