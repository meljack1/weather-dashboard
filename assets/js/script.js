const APIKey = "954a094b824cd8beb88a22ff29fc4fc0";

const searchBar = document.getElementById("searchbar");
const submitButton = document.getElementById("submit");
const clearButton = document.getElementById("clear-button");
const pastSearchesEl = document.getElementById("past-searches");

const cityTitleEl = document.querySelector('[data-attr="location"]');
const todaysDateEl = document.querySelector('[data-attr="date"]');
const weatherTodayEl = document.querySelector('[data-attr="weather-today"]')
const temperatureTodayEl = document.querySelector('[data-attr="temperature-today"]');
const windTodayEl = document.querySelector('[data-attr="wind-today"]');
const humidityTodayEl = document.querySelector('[data-attr="humidity-today"]');
const uvTodayEl = document.querySelector('[data-attr="uv-today"]');

// Gets date from unix timestamp
function getDateFromUnix(unix) {
    let dateObject = new Date(unix * 1000);
    const date = dateObject.toLocaleString().slice(0, 10);
    return date;
}

// Gets weekday from unix timestamp 
function getDayFromUnix(unix) {
    let dateObject = new Date(unix * 1000);
    const day = dateObject.toLocaleString("en-US", {weekday: "long"});
    return day;
}

function fetchCityCoordinates(city) {
    const requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + APIKey;
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if (data.length == 0) {
            alert("Sorry! No city with that name was found.")
            return;
        }
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        cityTitleEl.textContent = `${data[0].name}, ${data[0].country}`;
        // Add city to local storage
        addPastSearch(`${data[0].name}, ${data[0].country}`);
        getApiData(latitude, longitude);
        // Show past searches at side
        displayPastSearches();
        searchBar.value = "";
    });
}

// Gets city coordinates when you search
function getCityCoordinates(event) {
    event.preventDefault();
    const city = searchBar.value;
    fetchCityCoordinates(city);
}

// Gets coordinates of a past city when you click a grey button
function getPastCityCoordinates(event) {
    event.preventDefault();
    const city = this.textContent;
    fetchCityCoordinates(city);
}

// Determines how high the UV intensity is and returns a class name to add to UV span
function determineUVIntensity(uvi) {
    switch(true) {
        case uvi <= 2: 
            return "low-uv";
            break;
        case uvi <= 5: 
            return "moderate-uv";
            break;
        case uvi <= 7:
            return "high-uv";
            break;
        case uvi <= 10:
            return "very-high-uv";
            break;
        case uvi > 10: 
            return "extreme-uv";
            break;
    }
}

// Puts data for next 5 days into an array to populate the 5 forecast cards
function parse5DayWeatherData(data) {
    let fiveDays = [];
    for (let i=1; i <=5; i++) {
        const day = getDayFromUnix(data.daily[i].dt)
        const date = getDateFromUnix(data.daily[i].dt);
        const icon = data.daily[i].weather[0].icon;
        const temp = Math.round(data.daily[i].temp.day);
        const wind = data.daily[i].wind_speed;
        const humidity = data.daily[i].humidity;
        fiveDays.push({day: day, date: date, icon: icon,  temp: temp, wind: wind, humidity: humidity});
    }
    return fiveDays;
}

// Updates card with current forecast with data from API
function updateCurrentForecast(data) {
    const date = getDateFromUnix(data.current.dt);
    const icon = data.current.weather[0].icon;
    const temp = Math.round(data.current.temp);
    const wind = data.current.wind_speed;
    const humidity = data.current.humidity;
    const uvi = data.current.uvi;
    uvTodayEl.className = "";
    const intensity = determineUVIntensity(uvi);

    todaysDateEl.textContent = `(${date})`;
    weatherTodayEl.src = `./assets/images/${icon}.png`
    temperatureTodayEl.textContent = `${temp}°C`;
    windTodayEl.textContent = `${wind} m/s`;
    humidityTodayEl.textContent = `${humidity}%`;
    uvTodayEl.classList.add("badge");
    uvTodayEl.classList.add(`${intensity}`);
    uvTodayEl.textContent = uvi; 
}

// Updates 5 day forecast cards with data from API
function update5DayForecast(data) {
    let fiveDays = parse5DayWeatherData(data);
    for (let i=0; i < 5; i++) {
        const dayEl = document.querySelector(`[data-attr="day-${i}"]`);
        const dateEl = document.querySelector(`[data-attr="date-${i}"]`);
        const weatherEl = document.querySelector(`[data-attr="weather-${i}"]`);
        const temperatureEl = document.querySelector(`[data-attr="temperature-${i}"]`);
        const windEl = document.querySelector(`[data-attr="wind-${i}"]`);
        const humidityEl = document.querySelector(`[data-attr="humidity-${i}"]`);

        dayEl.textContent = fiveDays[i].day;
        dateEl.textContent = fiveDays[i].date;
        weatherEl.src = `./assets/images/${fiveDays[i].icon}.png`;
        temperatureEl.textContent = `${fiveDays[i].temp}°C`;
        windEl.textContent = `${fiveDays[i].wind} m/s`;
        humidityEl.textContent = `${fiveDays[i].humidity}%`; 
    }
}

// Gets weather data for coordinates obtained from getCityCoordinates
function getApiData(latitude, longitude) {
    const requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=' + APIKey;
  
    fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          updateCurrentForecast(data);
          update5DayForecast(data);
      });
}

// Get past searches from local storage
function getPastSearches() {
    const searches = localStorage.getItem("searches");
    if(!searches) {
        return [];
    }
    const searchesParsed = JSON.parse(searches);
    return searchesParsed;
}

// Add location to local storage
function addPastSearch(query) {
    const searches = getPastSearches();
    if (searches.includes(query)){
        return;
    } else {
        searches.push(query);
    }
    localStorage.setItem("searches", JSON.stringify(searches));
}

// Create new button for past searches
function createButton(query) {
    let button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-secondary");
    button.classList.add("m-1");
    button.textContent = query;
    button.addEventListener('click', getPastCityCoordinates);
    return button;
} 

//Show past searches as buttons in sidebar
function displayPastSearches() {
    const searches = getPastSearches();
    pastSearchesEl.textContent = "";
    for (let i = 0; i < searches.length; i++) {
        const pastSearch = createButton(searches[i]);
        pastSearchesEl.appendChild(pastSearch);
    }
}

// Clear past searches 
function clearPastSearches() {
    localStorage.clear();
    displayPastSearches();
}


fetchCityCoordinates("Birmingham, GB");
displayPastSearches();
submitButton.addEventListener("click", getCityCoordinates);
clearButton.addEventListener("click", clearPastSearches);