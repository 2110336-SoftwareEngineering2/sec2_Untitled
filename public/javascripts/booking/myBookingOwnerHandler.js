$("button[name='cancelBooking'").on('click', function(){
    let parent = $(this).parents("div").closest("[name='booking_parent'")
    let booking_id = $(this).attr('booking-id')
    $.ajax({
        url: `/book/my/petowner/${booking_id}`,
        method: "PATCH"
    }).done(function(data){
        if(data.success) parent.fadeOut()
        else {
            alert(data.message)
        }
    })
})