let cityTitle = document.querySelector(".title");
let mainTemp = document.querySelector(".current-temp");
let sunrise = document.querySelector(".sunrise");
let sunset = document.querySelector(".sunset");
let mainIconEl = document.querySelector(".main-icon");
let weatherDescription = document.querySelector(".weather-description");
let cardDisplay = document.querySelector(".future-weather");
const apiCode = "a18b7b7d681f9f81151a685023e74a6e";
let searchBtnEl = $(".search-btn");
let inputEl = document.querySelector(".input-field");
let favBtnEl = $(".favourite");
let listContainerEl = document.querySelector(".list-container");
let savedBtn = $(".saved");

let cityCoordinates = function (cityName) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=a18b7b7d681f9f81151a685023e74a6e`
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        fetchWeather(data[0].lat, data[0].lon);
      });
    }
  });
};

cityCoordinates("sydney");

let fetchWeather = function (lat, lon) {
  cardDisplay.innerHTML = "";
  datesList = [];
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&limit=&appid=a18b7b7d681f9f81151a685023e74a6e&units=metric`;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        let nameOfCity = data.city.name;
        cityTitle.textContent = `Todays weather in ${nameOfCity}: ${dayjs
          .unix(data.list[0].dt)
          .format("D/M/YYYY")}`;
        let humidityEL = data.list[0].main.humidity;
        let windSpeedEl = data.list[0].wind.speed;
        let currentTemp = data.list[0].main.temp;
        let currentWeather = data.list[0].weather[0].description;
        let mainIcon = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
        favBtnEl.value = nameOfCity;
        mainTemp.textContent = `Todays temperature ${currentTemp} degrees celciius`;
        sunrise.textContent = `Humidity: ${humidityEL}`;
        sunset.textContent = `Wind Speed: ${windSpeedEl}`;
        weatherDescription.textContent = `Current weather: ${currentWeather}`;
        mainIconEl.src = mainIcon;
        for (let i = 0; i < data.list.length; i++) {
          x = data.list[i];
          dt = data.list[i].dt_txt.split(" ");

          if (dt[1] == "00:00:00") {
            let card = document.createElement("card");
            let heading = document.createElement("h3");
            let humidityP = document.createElement("p");
            let maxTempP = document.createElement("p");
            let letPressure = document.createElement("p");
            let icon = document.createElement("img");
            let dateEl = document.createElement("h6");
            dateEl.textContent = `${data.city.name}\n${dayjs
              .unix(data.list[i].dt)
              .format("D/M/YYYY")}`;
            card.classList.add("forecast-card");
            icon.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
            humidityP.textContent = `Humidity: ${data.list[i].main.humidity}`;
            maxTempP.textContent = `Max temp: ${data.list[i].main.temp}`;
            letPressure.textContent = `Wind speed: ${data.list[i].wind.speed}`;
            card.appendChild(dateEl);
            card.appendChild(heading);
            card.appendChild(humidityP);
            card.appendChild(maxTempP);
            card.appendChild(letPressure);
            card.appendChild(icon);

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

searchBtnEl.click(function (event) {
  event.preventDefault();
  cityCoordinates(inputEl.value);
});

let savedObj = {
  cityList: [],
};

let checkSavedBtn = $(".check-saved-city");

let savedCity = function () {
  city = this.value;
  cityCoordinates(city);
};

let updateSaved = function () {
  listContainerEl.innerHTML = "";
  newItem = localStorage.getItem("savedObj");
  newItem = JSON.parse(newItem);
  newList = newItem.cityList;
  console.log(newList);
  newList.forEach((element) => {
    let listSavedEl = document.createElement("li");
    let listSavedBtnEl = document.createElement("button");
    let deleteBtnEl = document.createElement("button");
    deleteBtnEl.value = element;
    deleteBtnEl.classList.add(
      "btn",
      "btn-primary",
      "btn-sm",
      "delete-saved-city"
    );
    listSavedEl.classList.add("list-group-item");
    listSavedBtnEl.classList.add(
      "btn",
      "btn-primary",
      "btn-sm",
      "check-saved-city"
    );
    listSavedEl.appendChild(listSavedBtnEl);
    deleteBtnEl.textContent = "delete";
    listSavedEl.textContent = element;
    listSavedBtnEl.value = element;
    listSavedBtnEl.textContent = "view weather";
    listSavedEl.appendChild(listSavedBtnEl);
    listSavedEl.appendChild(deleteBtnEl);
    listContainerEl.appendChild(listSavedEl);
    listSavedBtnEl.addEventListener("click", savedCity);
    deleteBtnEl.addEventListener("click", deleteCity);
  });
};

favBtnEl.click(function (event) {
  let value = favBtnEl.value;
  if (!localStorage.getItem("savedObj")) {
    savedObj.cityList.push(value);
    localStorage.setItem("savedObj", JSON.stringify(savedObj));
    updateSaved();
  } else {
    tempObj = localStorage.getItem("savedObj");
    tempObj = JSON.parse(tempObj);
    savedObj = tempObj;
    if (savedObj.cityList.includes(value)) {
      return;
    } else {
      savedObj.cityList.push(value);
    }
    localStorage.setItem("savedObj", JSON.stringify(savedObj));
    updateSaved();
  }
});

let deleteCity = function (value) {
  let city = this.value;
  if (!localStorage.getItem("savedObj")) {
    return;
  } else {
    tempObj = JSON.parse(localStorage.getItem("savedObj"));
    savedObj = tempObj;
    savedObj.cityList = savedObj.cityList.filter(function (data) {
      return data !== city;
    });
    localStorage.setItem("savedObj", JSON.stringify(savedObj));
    updateSaved();
  }
};

updateSaved();
