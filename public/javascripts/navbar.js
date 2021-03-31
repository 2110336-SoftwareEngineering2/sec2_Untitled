var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);
var context = { notifications: [{ description: "desc", performerPicUrl: "someurl", createDatetime: new Date() }] };
var html = template(context);
document.getElementById('output').innerHTML = html

$.ajax({
    url: '/notifications',
    method: 'GET'
}).done(data => {
    console.log("DATA received")
    const notifications = data
    const html = template({notifications});
    console.log(html)
    $('#output').html(html)
})