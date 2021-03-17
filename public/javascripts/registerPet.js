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

  $('#cancel_button').click(function(){
      window.location.href = "https://se2-ypebr.run.goorm.io/account";
  })
  $('#save_button').click(function(){
        let newPet = {
              name: $('#name').val(),
              type: $(`.selected-icon`).attr('value'),
              gender: $('input[name="inlineRadioOptions"]:checked').val(),
              yearOfBirth: $('#daterangepicker').val(),
              appearance: $('#appearance').val()
        }
        console.log(newPet)
        $.ajax({
            url: '/register/pet',
            method: 'POST',
            data: newPet,
        dataType: "json",
        success: function(data){
            window.location.href = "https://se2-ypebr.run.goorm.io/account";
        },
        error: function(data){
           alert("Sorry we can't register your pet. Please tell support for help.");
        }
        })
  })

  $(document).ready(function(){
      $("#daterangepicker").daterangepicker({
          locale: {
              format: "DD/MM/YYYY"
          },
          startDate: dayjs().format("DD/MM/YYYY"),
          singleDatePicker: true,
          showDropdowns: true,
          autoApply: true
      })
  })