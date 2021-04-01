function editProfile(){
    window.location = '/account/edit'
}

function backtoProfile(){
    window.location = '/account'
}

function addPet(){
    window.location = '/account/register/pet'
}

$("#withdraw-btn").on("click", function() {
    console.log("click")
    $.ajax({
        url: '/account/withdraw',
        method: 'PATCH',
        data: {
            amount: $('#amount').val()
        }
    }).done(data => {
        if (data.username) window.location = "/account"
        else if (data=="impossible") alert("The amount must be positive")
        else alert("You don't have enough balance")
    })
})