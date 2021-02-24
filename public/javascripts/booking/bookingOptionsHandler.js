$(document).ready(function(){
    $("#daterangepicker").daterangepicker({
        locale: {
            format: "DD/MM/YYYY"
        },
        startDate: dayjs().format("DD/MM/YYYY"),
        singleDatePicker: false,
        autoApply: true
    })
})

$("#bookBtn").on('click', sendBookingRequest)

function sendBookingRequest(){
    let pets = getSelectedPets()
    if(pets.length == 0) {alert("Select at least one pet"); return;}
    let {startDate, endDate} = getStartAndEndDate()
    if(startDate == '' || endDate == '') {} // do something

    let psid = $("meta[name='pet-sitter-id'").attr('content')
    $.ajax({
        url: "/book",
        method: "POST",
        data: {
            startDate: startDate,
            endDate: endDate,
            sitter: psid,
            pets: pets
        }
    }).done(function(data){
        console.log(data)
        if(data.status) alert("DONE")
        else alert("FAILED")
    })
}

function getSelectedPets(){
    let pets_tag = $("#selectedPetZone").children()
    let pets = []
    for(let i=0; i<pets_tag.length; i++){
        pets.push(pets_tag.eq(i).attr("pet-id"))
    }
    return pets
}

function getStartAndEndDate(){
    let [startDate, endDate] = $("#daterangepicker").val().split(' - ')
    return {startDate, endDate}
}