$(document).ready(function(){
    var topics = {
        animals: ["golf","basketball","football","mma","soccer","tennis","lacross","hockey","baseball","rugby","table tennis","volleyball","field hockey","cricket","formula 1","volleyball","snowboarding","bowling"]
    };
    function bubble_Sort(a) {
        var swapp;
        var n = a.length-1;
        var x=a;
        do {
            swapp = false;
            for (var i=0; i < n; i++) {
                if (x[i] > x[i+1]) {
                   var temp = x[i];
                   x[i] = x[i+1];
                   x[i+1] = temp;
                   swapp = true;
                };
            };
            n--;
        } while (swapp);
     return x; 
    };
    topics.animals = bubble_Sort(topics.animals);

    console.log(topics.animals);
    function buttonGen() {
        $("#buttons").empty();
        for (i=0;i<topics.animals.length;i++) {
            var newButton = $("<button>")
            newButton.text(topics.animals[i]);
            newButton.attr("class","giphySearch btn btn-outline-info")
            $("#buttons").append(newButton);
        };
    };
    buttonGen();

    $(document).on('click','.giphySearch',function(){
        var queryURL = "https://api.giphy.com/v1/gifs/search?q="+$(this).text()+"&limit=10&api_key=Lk61WOxNUNNqUE4NAgrAeLrACvNBXyaz";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                console.log(response);
                $("#gifs").empty();
                for (i=0;i<response.data.length;i++) {
                    var newDiv = $("<div>");
                    newDiv.attr("class","col-lg-4")
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
    $("#searchSubmit").click(function(event) {
        event.preventDefault();
        let input = $("#searchTerm").val();
        $("#searchTerm").val("");
        topics.animals.push(input);
        topics.animals = bubble_Sort(topics.animals);
        buttonGen();
    });
});