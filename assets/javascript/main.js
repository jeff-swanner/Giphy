$(document).ready(function(){
    var topics = {
        animals: ["tiger","bear","lion"]
    };

    console.log(topics.animals);

    for (i=0;i<topics.animals.length;i++) {
        var newButton = $("<button>")
        newButton.text(topics.animals[i]);
        newButton.attr("class","giphySearch")
        $("#buttons").append(newButton);
    };

    $(".giphySearch").click(function(){
        var queryURL = "https://api.giphy.com/v1/gifs/search?q="+$(this).text()+"&limit=10&api_key=Lk61WOxNUNNqUE4NAgrAeLrACvNBXyaz";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                console.log(response);
                $("#gifs").empty();
                for (i=0;i<response.data.length;i++) {
                    var newDiv = $("<div>")
                    newDiv.html("<p>Rating: "+response.data[i].rating+"</p>");
                    var imageURL = response.data[i].images.fixed_width.url;
                    newImg = $("<img>");
                    newImg.attr("src",imageURL);
                    newImg.attr("alt","image");
                    newDiv.append(newImg);
                    $("#gifs").append(newDiv);
                };
            });
    });
});