$(".scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});

$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "PUT",
        url: "/articles/save/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});

$(".remove").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "PUT",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
        window.location = "/saved"
    })
});

// $(".note").on("click", function() {

// })