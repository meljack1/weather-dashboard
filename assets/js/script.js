const APIKey = "954a094b824cd8beb88a22ff29fc4fc0";
const cityTitleEl = document.querySelector('[data-attr="location"]')

// Gets city coordinates when you search
function getCityCoordinates(city) {
    const requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + APIKey;
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        cityTitleEl.textContent = data[0].name;
        getWeatherData(latitude, longitude);
    });
}

// Gets weather data for coordinates obtained from getCityCoordinates
function getWeatherData(latitude, longitude) {
    const requestUrl = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + APIKey;
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
}

 
getCityCoordinates("Birmingham");
