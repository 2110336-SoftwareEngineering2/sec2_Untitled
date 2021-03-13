$("button[name='cancelBooking'").on('click', function(){
    let booking_id = $(this).attr('booking-id')
    $.ajax({
        url: `/book/my/petowner/${booking_id}`,
        method: "PATCH"
    }).done(function(data){
        console.log(data)
    })
})