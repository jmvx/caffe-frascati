$(document).ready(function(){
  $(".menusection ul").hide();
  $(".menusection .open").hide();

  $(".menusection h1").click(function() {
    var parent = $(this).parent();
    var isvisible = $('ul', parent).is(':visible');
    if(isvisible) {
      $('ul', parent).hide();
      $('.open', this).hide();
      $('.closed', this).show();
    }
    else {
      $('.menusection ul').hide();
      $('.open').hide();
      $('.closed').show();
      $('ul', parent).show();
      $('.open', this).show();
      $('.closed', this).hide();
    }
  });
});