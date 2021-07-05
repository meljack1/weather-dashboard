const APIKey = "954a094b824cd8beb88a22ff29fc4fc0";

const searchBar = document.getElementById("searchbar");
const submitButton = document.getElementById("submit");

const cityTitleEl = document.querySelector('[data-attr="location"]');
const todaysDateEl = document.querySelector('[data-attr="date"]');
const temperatureTodayEl = document.querySelector('[data-attr="temperature-today"]');
const windTodayEl = document.querySelector('[data-attr="wind-today"]');
const humidityTodayEl = document.querySelector('[data-attr="humidity-today"]');
const uvTodayEl = document.querySelector('[data-attr="uv-today"]');

// Gets date from unix timestamp
function getDateFromUnix(unix) {
    let dateObject = new Date(unix * 1000);
    let date = dateObject.toLocaleString().slice(0, 10);
    return date;
}

// Gets city coordinates when you search
function getCityCoordinates(event) {
    event.preventDefault();
    const city = searchBar.value;
    const requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + APIKey;
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        cityTitleEl.textContent = data[0].name;
        getTodayWeatherData(latitude, longitude);
        get5DayWeatherData(latitude, longitude);
    });
}

// Gets weather data for coordinates obtained from getCityCoordinates
function getTodayWeatherData(latitude, longitude) {
    const requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + APIKey;
  
    fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          const date = getDateFromUnix(data.current.dt);
          const temp = data.current.temp;
          const wind = data.current.wind_speed;
          const humidity = data.current.humidity;
          const uv = data.current.uvi;
          updateCurrentForecast(date, temp, wind, humidity, uv);
      });
}

// Gets 5 day weather forecast for coordinates obtained by getCityCoordinates

function get5DayWeatherData(latitude, longitude) {
    const requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + APIKey;
  
    fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          let fiveDays = [];
          console.log(data);
          for (let i=1; i <=5; i++) {
            const date = getDateFromUnix(data.daily[i].dt);
            console.log(data.daily[i].dt);
            const temp = data.daily[i].temp.day;
            const wind = data.daily[i].wind_speed;
            const humidity = data.daily[i].humidity;
            fiveDays.push({date: date, temp: temp, wind: wind, humidity: humidity});
          }
          update5DayForecast(fiveDays)
      });
}

function updateCurrentForecast(date, temp, wind, humidity, uv) {
    todaysDateEl.textContent = date;
    temperatureTodayEl.textContent = `${temp}°C`;
    windTodayEl.textContent = `${wind} m/s`;
    humidityTodayEl.textContent = `${humidity}%`;
    uvTodayEl.textContent = uv;
}

function update5DayForecast(fiveDays) {
    for (let i=0; i < 5; i++) {
        const dateEl = document.querySelector(`[data-attr="date-${i}"]`);
        const temperatureEl = document.querySelector(`[data-attr="temperature-${i}"]`);
        const windEl = document.querySelector(`[data-attr="wind-${i}"]`);
        const humidityEl = document.querySelector(`[data-attr="humidity-${i}"]`);
        dateEl.textContent = fiveDays[i].date;
        temperatureEl.textContent = `${fiveDays[i].temp}°C`;
        windEl.textContent = `${fiveDays[i].wind} m/s`;
        humidityEl.textContent = `${fiveDays[i].humidity}%`; 
    }
}
 
submitButton.addEventListener("click", getCityCoordinates);