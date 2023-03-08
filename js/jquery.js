$(function () {

    var btn = $('#scrolled');
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
          btn.addClass('show');
        } 
        else {
          btn.removeClass('show');
        }
    });

    var $root = $('html, body');

    $('a[href^="#"]').click(function () {
        $root.animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 100);

        return false;
    });

    $('#aboutBtn').click(function(){
      $('.textAbout').slideToggle('slow');
    });

});