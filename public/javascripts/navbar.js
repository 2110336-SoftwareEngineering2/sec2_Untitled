var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = { notifications: [{description: "desc", performerPicUrl: "someurl", createDatetime: new Date()}] };
    var html = template(context);
    console.log(html)
    document.getElementById('output').innerHTML = html