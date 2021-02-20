/*<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span> full
<span class="fa fa-star checked"></span> full
<span class="fa fa-star-half-o checked"></span> half
<span class="fa fa-star-o checked"></span> none
<span class='font-weight-bolder ml-1' style="color: orange;">{{rating}}</span> */

const RATING_COLOR = "rgb(255, 165, 0)"
const NOT_CHECKED = "<span class='fa fa-star-o checked mr-1'></span>"
const CHECKED_HALF = `<span class='fa fa-star-half-o checked mr-1'></span>`
const CHECKED_FULL = `<span class='fa fa-star checked mr-1'></span>`

const RATING_TAG_OPEN = `<span class='font-weight-bolder ml-1' style='color: ${RATING_COLOR};'>`
const RATING_TAG_END = "</span>"

const TOTAL_STARS = 5

$(document).ready(function(){
    let star_div = $("div[rating")
    for(let i=0; i<star_div.length; i++){
        let div = star_div.eq(i)
        let rating = div.attr("rating")
        div.html(getStars(rating))
    }
})

function getStars(rating){
    let stars = ""
    let num_of_stars = Math.floor(rating)
    let isHalfStar = (rating - num_of_stars) > 0.5
    
    for(let i=0; i<TOTAL_STARS; i++){
        if(i < num_of_stars) stars = stars + CHECKED_FULL
        else if(i == num_of_stars && isHalfStar) stars = stars + CHECKED_HALF
        else stars = stars + NOT_CHECKED
    }

    stars  = stars + RATING_TAG_OPEN + rating + RATING_TAG_END
    return stars
}