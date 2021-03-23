const priceRate = $("meta[name='petSitterPriceRate").attr('content')
const psid = $("meta[name='petSitterId'").attr('content')

$(document).ready(function () {
    dayjs.extend(window.dayjs_plugin_customParseFormat)

    $("#daterangepicker").daterangepicker({
        locale: {
            format: "DD/MM/YYYY"
        },
        startDate: dayjs().format("DD/MM/YYYY"),
        singleDatePicker: false,
        autoApply: true
    })
})

// event listenings
$('#bookBtn').on('click', sendBookingRequest)
$('#daterangepicker').on('apply.daterangepicker', updateTotalPrice);
$('.dropzone').on('drop', updateTotalPrice)

function sendBookingRequest() {
    let pets = getSelectedPets()
    if (pets.length == 0) { alert("Select at least one pet"); return; }

    let { startDate, endDate } = getStartAndEndDate()
    if (startDate == '' || endDate == '') { } // do something

    let priceForEachPet = calculateTotalPrice(startDate, endDate, pets.length) / pets.length

    $.ajax({
        url: "/book",
        method: "POST",
        data: {
            startDate: startDate,
            endDate: endDate,
            sitter: psid,
            pets: pets,
            price: priceForEachPet
        }
    }).done(function (data) {
        if (data.status) window.location.href = '/book/my'
        else alert("FAILED")
    })
}

// startDate and endDate are in "DD/MM/YYYY" format
function calculateTotalPrice(startDate, endDate, num_of_pets) {
    let _startDate = dayjs(startDate, "DD/MM/YYYY")
    let _endDate = dayjs(endDate, "DD/MM/YYYY")
    // one day is added because 22/xx/xx - 22/xx/xx is 1 day, not 0
    let diff_in_day = _endDate.diff(_startDate, 'day') + 1
    return diff_in_day * num_of_pets * priceRate
}

function updateTotalPrice() {
    let { startDate, endDate } = getStartAndEndDate()
    let num_of_pets = getSelectedPets().length
    let totalPrice = calculateTotalPrice(startDate, endDate, num_of_pets)
    $("#priceTag").text(totalPrice)
}

function getSelectedPets() {
    let pets_tag = $("#selectedPetZone").children()
    let pets = []
    for (let i = 0; i < pets_tag.length; i++) {
        pets.push(pets_tag.eq(i).attr("pet-id"))
    }
    return pets
}

function getStartAndEndDate() {
    let [startDate, endDate] = $("#daterangepicker").val().split(' - ')
    return { startDate, endDate }
}