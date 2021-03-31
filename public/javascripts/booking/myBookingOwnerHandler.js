$("button[name='cancelBooking']").on('click', function(){
    let parent = $(this).parents("div").closest("[name='booking_parent']")
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

$(".pay-button").on('click', function(){
    let booking_id = $(this).attr('booking-id')
    const status = $(this).parent().prev()
    $.ajax({
        url: `/book/pay`,
        method: "PATCH",
        data : {booking_id}
    }).done(function(data){
        console.log(data)
        if(data.status) {
            window.location='/book/my'
        }
        else {
            alert("error")
        }
    })
})