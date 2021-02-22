
$("form").submit(function(evt) {
	const data = $('form').serializeArray()
	const [{value: location}, {}, {value: type}] = data;
	$.ajax({
		url: '/search/petsitter',
		method: 'POST',
		data: {
			location,
			type
		}
	}).done(function (data){
		console.log(data)	
		// change container display to flex
		const parent = $('.result-container')
		parent.addClass('d-block')
		parent.removeClass('d-none')
		data.forEach(result => {
			//const resultItem = document.createElement('li')
			//resultItem.innerText = "id : " + result.id + "      First Name : " + result.fname
			parent.append(`<li>id : ${result.id}      First Name : ${result.fname} </li>`)
		})
	});
	evt.preventDefault()
})