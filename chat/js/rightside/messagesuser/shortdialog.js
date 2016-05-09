

var ShortDialog = function(){

  var zcShadowLayer = '<div class="zc-shadow-layer" >'+
  '</div>';

  var hide = function() {
      $(zcShadowLayer).find(".fade.in").animate({
          'opacity' : 0
      },300, function() {
          setTimeout(function() {
              $layer.remove();
          },100);
      });
  };

};
