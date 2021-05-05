$(".frame-icon").hover(function(){
    $(this).addClass("hover-icon");
    }, function(){
    $(this).removeClass("hover-icon");
  });
  
  $(".frame-icon").click(function(){
      if( $(this).hasClass('selected-icon') ) {
            $(this).removeClass("selected-icon");
            $(this).find(".activity-icon").css("color", "white");
      } else {
            $(`.selected-icon`).find(".activity-icon").css("color", "white");
            $(`.selected-icon`).removeClass("selected-icon");
            $(this).addClass("selected-icon");
            $(this).find(".activity-icon").css("color", "white");
      }
  });

  $('#cancel_button').click(function(){
      window.location.href = "/account";
  })
  $('#save_button').click(function(){
        let newPet = {
              name: $('#name').val(),
              type: $(`.selected-icon`).attr('value'),
              gender: $('input[name="inlineRadioOptions"]:checked').val(),
              yearOfBirth: $('input[name="yearOfBirth"]').val(),
              appearance: $('#appearance').val()
        }
        $.ajax({
            url: '/account/register/pet',
            method: 'POST',
            data: newPet
        }).done(data => {window.location.replace(data)})
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