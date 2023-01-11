let cityTitle = document.querySelector(".title");
let mainTemp = document.querySelector(".current-temp");
let sunrise = document.querySelector(".sunrise");
let sunset = document.querySelector(".sunset");
let weatherDescription = document.querySelector(".weather-description");
let cardDisplay = document.querySelector(".future-weather");
const apiCode = "a18b7b7d681f9f81151a685023e74a6e";

const dayjs = require("day.js");
const dayjsTimezone = require("dayjs-timezone");
dayjs.extend(dayjsTimezone);

const city = "New York";
const timezone = "America/New_York";
const gmtTime = dayjs().tz("UTC");
const localTime = gmtTime.clone().tz(timezone);
console.log(localTime.format());

let fetchWeather = function (lat, lon) {
  datesList = [];
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&limit=&appid=a18b7b7d681f9f81151a685023e74a6e&units=metric`;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        let nameOfCity = data.city.name;
        cityTitle.textContent = `Todays weather in ${nameOfCity}`;
        let humidityEL = data.list[0].main.humidity;
        let pressureEL = data.list[0].main.pressure;
        let dates = [];
        let currentTemp = data.list[0].main.temp;
        let icon = data.list[0].weather[0].icon;
        let currentWeather = data.list[0].weather[0].description;
        mainTemp.textContent = `Todays temperature ${currentTemp} degrees celciius`;
        sunrise.textContent = `Humidity: ${humidityEL}`;
        sunset.textContent = `Pressure: ${pressureEL}`;
        weatherDescription.textContent = `Current weather: ${currentWeather}`;
        for (let i = 0; i < data.list.length; i++) {
          x = data.list[i];
          dt = data.list[i].dt_txt.split(" ");

          if (dt[1] == "12:00:00") {
            console.log(data.list[i]);
            let card = document.createElement("card");
            let heading = document.createElement("h3");
            let humidityP = document.createElement("p");
            let maxTempP = document.createElement("p");
            let letPressure = document.createElement("p");
            heading.textContent = data.city.name;
            humidityP.textContent = `Humidity: ${data.list[i].main.humidity}`;
            maxTempP.textContent = `Max temp: ${data.list[i].main.temp}`;
            letPressure.textContent = `Pressure: ${data.list[i].main.pressure}`;
            card.appendChild(heading);
            card.appendChild(humidityP);
            card.appendChild(maxTempP);
            card.appendChild(letPressure);

            cardDisplay.appendChild(card);
          }
        }
        console.log(datesList);
      });
    } else {
      alert(`Error ${response.statusText}`);
    }
  });
};

let init = function () {
  fetchWeather("-33.8651", "151.20");
};

init();

let fetchGeoLocation = function (cityName, countryCode) {
  let apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode},&appid=${apiCode}`;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    } else {
      alert(`Error ${response.statusText}`);
    }
  });
};
