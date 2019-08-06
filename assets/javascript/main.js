$(document).ready(function(){
    var topics = {
        animals: ["golf","basketball","football","mma","soccer","tennis","lacross","hockey","baseball","rugby","table tennis","volleyball","field hockey","cricket","formula 1","nascar","snowboarding","bowling"]
    };
    var category;
    var offset;
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

    function buttonGen() {
        $("#buttons").empty();
        for (i=0;i<topics.animals.length;i++) {
            var newButton = $("<button>")
            newButton.text(topics.animals[i]);
            newButton.attr("class","giphySearch btn btn-outline-info")
            $("#buttons").append(newButton);
        };
    };
    topics.animals = bubble_Sort(topics.animals);
    buttonGen();

    $(document).on('click','.giphySearch',function() {
        $(this).addClass('active').siblings().not(this).removeClass('active');
        offset = 0;
        category = $(this).text();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q="+category+"&limit=10&api_key=Lk61WOxNUNNqUE4NAgrAeLrACvNBXyaz";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            $("#gifs").empty();
            for (i=0;i<response.data.length;i++) {
                var newDiv = $("<div>");
                newDiv.attr("class","col-lg-4");
                newDiv.html("<p>Rating: "+response.data[i].rating+"</p>");
                var fixedURL = response.data[i].images.fixed_width_still.url;
                var animatedURL = response.data[i].images.fixed_width.url;
                newImg = $("<img>");
                newImg.attr("src",fixedURL);
                newImg.attr("class","gifDisplay");
                newImg.attr("data-fixed",fixedURL);
                newImg.attr("data-animated",animatedURL);
                newImg.attr("data-state","fixed");
                newImg.attr("alt","image");
                newDiv.append(newImg);
                $("#gifs").append(newDiv);
            };
            var newButton = $("<button>");
            newButton.attr("class","col-lg-12 btn btn-outline-info loadMoreButton");
            newButton.text("Load 10 More");
            newButton.attr("data-search",category);
            $("#gifs").append(newButton);
        });
        
    });

    $(document).on('click','.loadMoreButton',function(){
        offset+=10;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q="+$(this).attr("data-search")+"&offset="+offset+"&limit=10&api_key=Lk61WOxNUNNqUE4NAgrAeLrACvNBXyaz";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            $(".loadMoreButton").remove();
            for (i=0;i<response.data.length;i++) {
                var newDiv = $("<div>");
                newDiv.attr("class","col-lg-4");
                newDiv.html("<p>Rating: "+response.data[i].rating+"</p>");
                var fixedURL = response.data[i].images.fixed_width_still.url;
                var animatedURL = response.data[i].images.fixed_width.url;
                newImg = $("<img>");
                newImg.attr("src",fixedURL);
                newImg.attr("class","gifDisplay");
                newImg.attr("data-fixed",fixedURL);
                newImg.attr("data-animated",animatedURL);
                newImg.attr("data-state","fixed");
                newImg.attr("alt","image");
                newDiv.append(newImg);
                $("#gifs").append(newDiv);
            };
            var newButton = $("<button>");
            newButton.attr("class","col-lg-12 btn btn-outline-info loadMoreButton");
            newButton.text("Load 10 More");
            newButton.attr("data-search",category);
            $("#gifs").append(newButton);
        });
    });

    $(document).on('click','.gifDisplay',function(){
        if ($(this).attr("data-state")==="fixed") {
            $(this).attr("src",$(this).attr("data-animated"));
            $(this).attr("data-state","animated");
        } else {
            $(this).attr("src",$(this).attr("data-fixed"));
            $(this).attr("data-state","fixed");
        };
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