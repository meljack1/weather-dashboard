const APIKey = "954a094b824cd8beb88a22ff29fc4fc0";
const cityTitleEl = document.querySelector('[data-attr="location"]');
const dateEl = document.querySelector('[data-attr="date"]');
const temperatureTodayEl = document.querySelector('[data-attr="temperature-today"]');
const windTodayEl = document.querySelector('[data-attr="wind-today"]');
const humidityTodayEl = document.querySelector('[data-attr="humidity-today"]');
const uvTodayEl = document.querySelector('[data-attr="uv-today"]');

function getDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    console.log(today);
    return today;
}

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
          const date = getDate();
          const temp = data.current.temp;
          const wind = data.current.wind_speed;
          const humidity = data.current.humidity;
          const uv = data.current.uvi;
          updateCurrentForecast(date, temp, wind, humidity, uv)
          console.log(data);
      });
}

function updateCurrentForecast(date, temp, wind, humidity, uv) {
    dateEl.textContent = `(${date})`;
    temperatureTodayEl.textContent = `${temp}°C`;
    windTodayEl.textContent = `${wind} m/s`;
    humidityTodayEl.textContent = `${humidity}%`;
    uvTodayEl.textContent = uv;

    console.log(date + temp + wind + humidity + uv)
}

function update5DayForecast() {

}
 
getCityCoordinates("Edinburgh, UK");
