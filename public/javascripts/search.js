const RATING_COLOR = "rgb(255, 165, 0)"
const NOT_CHECKED = "<span class='fa fa-star-o checked mr-1'></span>"
const CHECKED_HALF = `<span class='fa fa-star-half-alt checked mr-1'></span>`
const CHECKED_FULL = `<span class='fa fa-star checked mr-1'></span>`

const RATING_TAG_OPEN = `<span class='font-star font-weight-bolder ml-1' style='color: ${RATING_COLOR};'>`
const RATING_TAG_END = "</span>"

const TOTAL_STARS = 5

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

function genStars(){
	let star_div = $("div[rating")
    for(let i=0; i<star_div.length; i++){
        let div = star_div.eq(i)
        let rating = div.attr("rating")
        div.html(getStars(rating))
    }
}

function getContent(result){
	const dummyPicUrl = 'https://bootdey.com/img/Content/avatar/avatar1.png'
	result.picUrl = result.picUrl == null ? dummyPicUrl : result.picUrl
	return `<div class="col-md-3 p-1 search-result-item text-center">
				<a class="image-link" href="/book/${result.id}">
					<img class="image rounded-circle" src="${result.picUrl}">
				</a>
				<div class="star" style="font-size: 1.15rem;" rating=${result.rating}>
				</div>
				<h4 class="search-result-item-heading text-truncate m-0"><a href="/book/${result.id}" class="username">${result.fname}</a></h4>
				<p class="info text-truncate">${result.location}</p>


				<p class="value3 mt-sm"><i class="fa fa-money" aria-hidden="true"></i>  ${result.priceRate} baht/hr</p>
				<a class="btn btn-dark btn-info btn-sm" href="/book/${result.id}/options">Book</a>
			</div>`
}

$("form").submit(function(evt) {
	const data = $('form').serializeArray()
	let location = undefined
	let type = undefined
	for(let i=0; i<data.length; i++){
		if(data[i].name == 'type') type = data[i].value
		if(data[i].name == 'location') location = data[i].value
	}
	$.ajax({
		url: '/search/petsitter',
		method: 'POST',
		data: {
			location,
			type
		}
	}).done(function (data){
		console.log(data)
		$("#search-result").fadeIn(function(){
			// change container display to flex
			const parent = $('.result-container')
			parent.addClass('d-block')
			parent.removeClass('d-none')
			// clear old contents
			parent.html('')
			// display number of results
			$("#result-count").text(`About ${data.length} results`)
			// then append new contents
			data.forEach(result => {
				parent.append(getContent(result))
			})
			genStars()
		})
		
	});
	evt.preventDefault()
})

$(this).find('input').keypress(function(e) {
	if(e.which == 10 || e.which == 13) {
	  this.form.submit();
	}
});