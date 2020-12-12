var moment = moment();
var searchBtn = $("#search");
var inputElement = $("#citySearch");
var cityH2 = $("#citysName");
var todaysDate = $("#currentDate");
var weatherEmojiToday = $("#weatherEmoji");
var mainTemp = $("#current-temp");
var mainHumidity = $("#current-humidity");
var mainWind = $("#current-wind");
var mainUV = $("#current-UV");
var fiveDayForecastHeader = $("#fiveDayForecastHeader");
var fiveDayForecast = $("#fiveDayForecast");
var mainCardDiv = $("#card-div");
var secondCardDiv = $("#card-div-2");
var searchHistoryList = $("#searchHistory");

var currentCity;

var APIKey = "42dadc742001b9a6775c3b89a2bd6194";

var allSearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

function searchCity() {
    

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=imperial&appid=" + APIKey;

    if (currentCity != null) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (cityWeatherData) {

            mainCardDiv.css("display", "block");
            secondCardDiv.css("display", "block");
            inputElement.val("");
            
            cityH2.text(cityWeatherData.name);
            todaysDate.text("(" + moment.format('MMMM DD YYYY') + ")");
            var weatherIcon = renderIcons(cityWeatherData);
            weatherEmojiToday.attr("src", weatherIcon);
            mainTemp.text("Temperature: " + Math.floor(cityWeatherData.main.temp) + " F");
            mainHumidity.text("Humidity: " + cityWeatherData.main.humidity +"%");
            mainWind.text("Wind Speed: " + Math.floor(cityWeatherData.wind.speed) + " mph");


            var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityWeatherData.coord.lat + "&lon=" + cityWeatherData.coord.lon + "&appid=" + APIKey;
            $.ajax({ 
                url: uvQuery,
                method: "GET"
            }).then(function (uvData) {
                mainUV.text(uvData.value);
                uvColor(mainUV, uvData.value);

            })

            var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&units=imperial&appid=" + APIKey;

            $.ajax({
                url: fiveDayForecastURL,
                method: "GET"
            }).then(function (fiveDayData) {
                console.log(fiveDayData);

                fiveDayForecastHeader.css("display", "block");
                var day = 1;

                fiveDayForecast.empty();

                for (var i = 5; i < fiveDayData.list.length; i += 8) {
                    var weatherImage = renderIcons(fiveDayData.list[i]);

                    var dayEl = $(`
                    <div class="card five-day-forecast">
                        <div class="card-body">
                            <h5 class="card-title">Day ${day}</h5>
                            <img src="${weatherImage}" class="card-text fiveDayForecastImg">
                            <p class="card-text">Temp: ${Math.floor(fiveDayData.list[i].main.temp)} F</p>
                            <p class="card-text">Humidity: ${fiveDayData.list[i].main.humidity}%</p>
                        </div>
                    </div>
                    `)
                    fiveDayForecast.append(dayEl);
                    day++;
                }

            })
        })
    }
}

function searchHistory() {
    for (var index = 0; index < allSearches.length; index++) {
        var searchedItem = $(`<li class="list-group-item search-history" value="${allSearches[index]}">${allSearches[index]}</li>`);
        searchHistoryList.prepend(searchedItem);
    }
}

function uvColor(element, number) {
    
    if (number < 3) {
        element.addClass("lowUV");
    } else if (number >= 3 && number < 8) {
        element.addClass("mediumUV");
    } else {
        element.addClass("highUV");
    }
}

function renderIcons(weatherData) {
    if (weatherData.weather[0].description === "clear sky") {
        return "http://openweathermap.org/img/wn/01d@2x.png";
    } else if (weatherData.weather[0].description === "few clouds"){
        return "http://openweathermap.org/img/wn/02d@2x.png";
    } else if (weatherData.weather[0].description === "scattered clouds" || weatherData.weather[0].description === "overcast clouds"){
        return "http://openweathermap.org/img/wn/03d@2x.png";
    } else if (weatherData.weather[0].description === "broken clouds"){
        return "http://openweathermap.org/img/wn/04d@2x.png";
    } else if (weatherData.weather[0].description === "shower rain" || weatherData.weather[0].description === "light rain"){
        return "http://openweathermap.org/img/wn/09d@2x.png";
    } else if (weatherData.weather[0].description === "rain"){
        return "http://openweathermap.org/img/wn/10d@2x.png";
    } else if (weatherData.weather[0].description === "thunderstorm"){
        return "http://openweathermap.org/img/wn/11d@2x.png";
    } else if (weatherData.weather[0].description === "snow"){
        return "http://openweathermap.org/img/wn/13d@2x.png";
    } else if (weatherData.weather[0].description === "mist"){
        return "http://openweathermap.org/img/wn/50d@2x.png";
    } else {
        return "";
    }
}





window.addEventListener('load', function () {

    searchHistory();


    searchBtn.on("click", function(event) {
        event.preventDefault();

        currentCity = inputElement.val().trim();
        

        var previouslySearchedLi = $(`<li class="list-group-item search-history" value="${currentCity}">${currentCity}</li>`); // Add city to list of previously searched

        allSearches.push(currentCity);

        localStorage.setItem("previousSearches", JSON.stringify(allSearches));

        searchHistoryList.prepend(previouslySearchedLi);

        searchCity();
    });

    searchHistoryList.on("click", function (event) {
        var listItem = $(event.target);
        currentCity = listItem[0].firstChild.data;
        
        searchCity();
    })
})