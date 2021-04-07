
$(document).ready(function () {
    let star1_percent = $(".star1_percent").text();
    let star2_percent = $(".star2_percent").text();
    let star3_percent = $(".star3_percent").text();
    let star4_percent = $(".star4_percent").text();
    let star5_percent = $(".star5_percent").text();
    $("#5_star_bar").effect("size", {
        to: { width: star5_percent }
    }, 200);
    $("#4_star_bar").effect("size", {
        to: { width: star4_percent }
    }, 200);
    $("#3_star_bar").effect("size", {
        to: { width: star3_percent }
    }, 200);
    $("#2_star_bar").effect("size", {
        to: { width: star2_percent }
    }, 200);
    $("#1_star_bar").effect("size", {
        to: { width: star1_percent }
    }, 200);
})