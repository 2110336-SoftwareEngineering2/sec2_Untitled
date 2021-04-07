var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

$.ajax({
    url: '/notifications',
    method: 'GET'
}).done(data => {
    const html = template({notifications: data});
    $('#output').html(html)
})

$( document ).ready(function() {
    // at start
    // if ($(window).width() < 975) {
    //     $('.navbar').removeClass('navbar-light')
    //     $('.navbar').removeClass('bg-transparent')
    //     $('.navbar').addClass('bg-dark')
    //     $('.navbar').addClass('navbar-dark')
    // } else {
    //     $('.navbar').removeClass('navbar-dark')
    //     $('.navbar').removeClass('bg-dark')
    //     $('.navbar').addClass('bg-transparent')
    //     $('.navbar').addClass('navbar-light')
    // }
    $('.bell').mouseup(function(){
        $('.fa-bell').addClass('animate-wobble')
        $('.fa-bell').delay(1000).queue(function(){
            $('.fa-bell').removeClass('animate-wobble').dequeue(); 
          });
    })
});

// when change size
// $(window).resize(function() {
//     console.log($(window).width())
//     if ($(window).width() < 975) {
//         $('.navbar').removeClass('navbar-light')
//         $('.navbar').removeClass('bg-transparent')
//         $('.navbar').addClass('bg-dark')
//         $('.navbar').addClass('navbar-dark')
//     } else {
//         $('.navbar').removeClass('navbar-dark')
//         $('.navbar').removeClass('bg-dark')
//         $('.navbar').addClass('bg-transparent')
//         $('.navbar').addClass('navbar-light')
//     }
// })