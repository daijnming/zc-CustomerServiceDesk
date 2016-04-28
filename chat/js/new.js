$(function(){
  $('.joinBox-yy').mouseenter(function(){
    $('#waitNum').css({
      'color': '#09c0c1'
    })
    $('.joinBox-yy i').addClass('i-hover');
  }).mouseleave(function(){
    $('#waitNum').css({
      'color': '#09aeb0'
    })
    $('.joinBox-yy i').removeClass('i-hover');
  })
})
