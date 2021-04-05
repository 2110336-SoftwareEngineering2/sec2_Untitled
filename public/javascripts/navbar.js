var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

$.ajax({
    url: '/notifications',
    method: 'GET'
}).done(data => {
    data = data.reverse()
    const html = template({notifications: data});
    $('#output').html(html)
})