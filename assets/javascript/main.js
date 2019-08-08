$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyBO6MDLQR-1NRye3-afG30crwJ0AtD9AjU",
        authDomain: "giphy-54709.firebaseapp.com",
        databaseURL: "https://giphy-54709.firebaseio.com",
        projectId: "giphy-54709",
        storageBucket: "",
        messagingSenderId: "772101188776",
        appId: "1:772101188776:web:851c88ac14db2c31"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
    var favorites = false;
    // Object with array holding gif search termw
    var topics = {
        sports: ["golf","basketball","football","mma","soccer","tennis","lacross","hockey","baseball","rugby","table tennis","volleyball","field hockey","cricket","formula 1","nascar","snowboarding","bowling"]
    };

    // List of global variables
    var category;
    var offset;

    // Bubble sort used to keep search terms in alphabetical order
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

    // Generates initial sports buttons and regens when new sports are added
    function buttonGen() {
        $("#buttons").empty();
        for (i=0;i<topics.sports.length;i++) {
            var newButton = $("<button>")
            newButton.text(topics.sports[i]);
            newButton.attr("class","giphySearch btn btn-outline-info")
            $("#buttons").append(newButton);
        };
    };

    // Search gif images from Giphy and adds to HTML
    function gifGen() {
        var queryURL = "https://api.giphy.com/v1/gifs/search?q="+category+"&offset="+offset+"&limit=10&api_key=Lk61WOxNUNNqUE4NAgrAeLrACvNBXyaz";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
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
                var favoriteButton = $("<button>");
                favoriteButton.attr("class","fa fa-star-o btn btn-outline-info");
                favoriteButton.attr("id","testButton");
                favoriteButton.attr("data-fixed",fixedURL);
                favoriteButton.attr("data-animated",animatedURL);
                newDiv.append(favoriteButton);
                $("#gifs").append(newDiv);
            };
            if (response.data.length === 10) {
                var newButton = $("<button>");
                newButton.attr("class","col-lg-12 btn btn-outline-info loadMoreButton");
                newButton.text("Load More");
                newButton.attr("data-search",category);
                $("#gifs").append(newButton);
            } else {
                var newButton = $("<button>");
                newButton.attr("class","col-lg-12 btn btn-outline-info disabled");
                newButton.text("No More Gifs To Load");
                $("#gifs").append(newButton);
            };
        });
    };

    function databaseCall() {
        $("#gifs").empty();
        database.ref("/favorites").on("child_added", function(childSnapshot) {
            console.log("test");
            if (favorites) {
                var newDiv = $("<div>");
                newDiv.attr("class","col-lg-4");
                newDiv.html("<p>Rating: "+"pg"+"</p>");
                var fixedURL = childSnapshot.val().fixedURL;
                var animatedURL = childSnapshot.val().animatedURL;
                newImg = $("<img>");
                newImg.attr("src",fixedURL);
                newImg.attr("class","gifDisplay");
                newImg.attr("data-fixed",fixedURL);
                newImg.attr("data-animated",animatedURL);
                newImg.attr("data-state","fixed");
                newImg.attr("alt","image");
                newDiv.append(newImg);
                var favoriteButton = $("<button>");
                favoriteButton.attr("class","fa fa-star btn btn-outline-info");
                favoriteButton.attr("id","testButton");
                favoriteButton.attr("data-fixed",fixedURL);
                favoriteButton.attr("data-animated",animatedURL);
                favoriteButton.attr("data-key",childSnapshot.key);
                newDiv.append(favoriteButton);
                $("#gifs").append(newDiv);
            };
        });
    };

    // Initial page load, generates search buttons
    topics.sports = bubble_Sort(topics.sports);
    buttonGen();

    // Calls gifGen function when search button is clicked
    $(document).on('click','.giphySearch',function() {
        $("#favorites").removeClass('active');
        favorites = false;
        $(this).addClass('active').siblings().not(this).removeClass('active');
        offset = 0; // Tracks offset when loading more gifs
        category = $(this).text();
        $("#gifs").empty();
        gifGen();
    });

    // Loads 10 more gifs when load more button is clicked
    $(document).on('click','.loadMoreButton',function(){
        offset+=10;
        $(".loadMoreButton").remove();
        gifGen();
    });

    // Animates gifs when clicked on, and stops when clicked again
    $(document).on('click','.gifDisplay',function(){
        if ($(this).attr("data-state")==="fixed") {
            $(this).attr("src",$(this).attr("data-animated"));
            $(this).attr("data-state","animated");
        } else {
            $(this).attr("src",$(this).attr("data-fixed"));
            $(this).attr("data-state","fixed");
        };
    });

    // Takes sport input when submit button is clicked and adds to search button list
    $("#searchSubmit").click(function(event) {
        event.preventDefault();
        let input = $("#searchTerm").val().toLowerCase();
        $("#searchTerm").val("");
        topics.sports.push(input);
        topics.sports = bubble_Sort(topics.sports);
        buttonGen();
    });
    // Adds and removes from favorites
    $(document).on('click','.fa',function(e){
        if ($(this).attr("class")==="fa fa-star btn btn-outline-info"&&favorites) {
            $(this).attr("class","fa fa-star-o btn btn-outline-info");
            database.ref("/favorites").child($(this).attr("data-key")).remove();
            databaseCall();
        } else if ($(this).attr("class")==="fa fa-star-o btn btn-outline-info") {
            $(this).attr("class","fa fa-star btn btn-outline-info");
            database.ref("/favorites").push({
                fixedURL: $(this).attr("data-fixed"),
                animatedURL: $(this).attr("data-animated")
            });
        };
    });

    // Loads favorites Gifs
    $(document).on('click','#favorites',function(){
        $(this).addClass('active');
        $(".giphySearch").removeClass('active');
        favorites = true;
        databaseCall();
    });
});

