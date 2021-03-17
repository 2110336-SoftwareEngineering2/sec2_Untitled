$(".function-icon").hover(function(){
    $(this).addClass("hover-icon");
    }, function(){
    $(this).removeClass("hover-icon");
  });
  
  $(".function-icon").click(function(){
      if( $(this).hasClass('selected-icon') ) {
            $(this).removeClass("selected-icon");
            $(this).find(".activity-icon").css("color", "#0d6efd");
      } else {
            $(`.selected-icon`).find(".activity-icon").css("color", "#0d6efd");
            $(`.selected-icon`).removeClass("selected-icon");
            $(this).addClass("selected-icon");
            $(this).find(".activity-icon").css("color", "white");
      }
  });