var apiKey = "&appid=42dadc742001b9a6775c3b89a2bd6194";
var farenheit = "&units=imperial";
var city = "";




$("button").on("click", function () {
    city = $('.search-query').val();
    var historyContainer = $('#search-history-container')
    var cityHistory = $('<li>');
    cityHistory.text(city);
    historyContainer.append(cityHistory);
    var queryUrlFiveDayForecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + apiKey;
    var queryUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + farenheit + apiKey;

    $.ajax({
        url: queryUrlCurrent,
        method: "GET"
    }).then(function (currentForecast) {

        $.ajax({
            url: queryUrlFiveDayForecast,
            method: "GET"
        }).then(function (fiveDayForecast) {
            
            console.log(currentForecast.name);
            console.log(fiveDayForecast);

            for(var i = 0; i < fiveDayForecast.length; i += 8) {
               var newForecastDiv = $('<div>').text(fiveDayForecast.list[i]);
               $('#five-day-forecast').append(newForecastDiv);
            }   
            




        });

    });





});