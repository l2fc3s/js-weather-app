const changeBackgroundImage = (data) => {
  document.body.style.background = `url(./background-images/${data.weather[0].icon}.jpg)`;
  document.body.style.backgroundColor = "rgb(38, 49, 80)";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
};

const months = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let latitude;
let longitude;
const apiKey = "eee3276fd98cb728fa9c4303282c4b36";
let weatherCity = document.getElementById("weatherHeader");
let weatherCountry = document.getElementById("weatherHeaderCountry");
let weatherInfo = document.getElementById("weatherDescription");
let currentTemp = document.getElementById("weatherTemp");
let tempHigh = document.getElementById("weatherHigh");
let lowTemp = document.getElementById("weatherLow");
let apiLoader = document.getElementById("apiLoader");
let weatherIconContainer = document.getElementById("weatherIconContainer");
let weatherImage = document.getElementById("weatherIcon");
let forecast = document.getElementById("forecastList");

let feelsLike = document.getElementById("feelsLike");
let humidity = document.getElementById("humidity");
let windSpeed = document.getElementById("windSpeed");
let cloudPercentage = document.getElementById("cloudPercentage");
let weatherVisibility = document.getElementById("visibility");
let pressure = document.getElementById("pressure");

let navIcon = document.getElementById("navIcon");
let navMenu = document.querySelector(".nav-menu");
let closeNavIcon = document.getElementById("closeNavIcon");
let navBar = document.getElementById("navBar");

// navbar and search section --------------------

navIcon.addEventListener("click", () => {
  navMenu.style.display = "block";
  navIcon.style.display = "none";
  closeNavIcon.style.display = "block";
  document.body.style.position = "fixed";
});

const closeNav = () => {
  closeNavIcon.style.display = "none";
  navIcon.style.display = "block";
  navMenu.style.display = "none";
  document.body.style.position = "static";
};

closeNavIcon.addEventListener("click", closeNav);
const form = document.getElementById("searchForm");
const searchResults = document.getElementById("searchResults");

window.addEventListener("click", () => {
  if (searchResults.style.display === "block") {
    searchResults.style.display = "none";
  }
});

const locationSearch = (e) => {
  e.preventDefault();
  let textBoxValue = document.getElementById("textBox").value;

  if (!textBoxValue) {
    console.log("empty form");
    return null;
  }

  searchResults.style.display = "block";

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${textBoxValue}&limit=5&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let results = [...data];

      searchResults.innerHTML = results
        .map((item, index) => {
          return `
        <div id="${index}" data-value="${index}" class="result-item"><a>${
            item.name
          }, ${item.state ? item.state : ""}   ${item.country} </a></div>
        `;
        })
        .join("");

      let clickedResult = document.querySelectorAll(".result-item");

      clickedResult.forEach(function (item) {
        item.onclick = function (e) {
          latitude = results[this.getAttribute("data-value")].lat;
          longitude = results[this.getAttribute("data-value")].lon;
          isMyLocationUsed = false;
          fetchWeather();
          closeNav();
        };
      });

      if (results.length === 0) {
        searchResults.innerHTML = "No results..";
        return null;
      }
    });
};
form.addEventListener("submit", locationSearch);

let historyObj = {};
let cityHistory = document.getElementById("cityHistory");

function updateWeatherHistory(obj) {
  historyObj[`"${obj.name}"`] = {
    name: obj.name,
    lat: obj.coord.lat,
    lon: obj.coord.lon,
  };

  html = `
  <div 
  data-value="${obj.name}" 
   class='list-item-content' style="background: url(./background-images/${
     obj.weather[0].icon
   }.jpg);
    background-repeat: no-repeat;
    background-size: cover;
  " >
  
  <i onClick='handleDelete(this)' class="las la-minus-circle deleteOrSearchIcon"></i>
  
    <div
    data-value="${obj.name}" 
    onClick='historyClickedItem(this)'
    class="listItem-name-condition">
      <h2>${obj.name}</h2>
      <p>${obj.weather[0].main} </p>
    </div>

    
    <div 
    data-value="${obj.name}" 
    onClick='historyClickedItem(this)'
    class="listItem-temp-container">
      <h1>${Math.round(obj.main.temp)}&deg; </h1>
      <div>
        <p>H: ${Math.round(obj.main.temp_max)}&deg;</p>
        <p>L: ${Math.round(obj.main.temp_min)}&deg; </p>  
      </div>
    </div>
  </div>
  
`;

  cityHistory.insertAdjacentHTML("beforeend", html);
}

let searchLocationIcon = document.getElementById("searchLocationIcon");
let myLocationNameContainer = document.getElementById(
  "myLocationNameContainer"
);
let myLocationTempContainer = document.getElementById(
  "myLocationTempContainer"
);
let myLocationElements = [
  searchLocationIcon,
  myLocationNameContainer,
  myLocationTempContainer,
];

myLocationElements.forEach((el) =>
  el.addEventListener("click", () => {
    getWeatherLocation();
    closeNav();
  })
);

function updateMyLocation(obj) {
  let listItemContent = document.getElementById("listItemContent");
  let myLocationCity = document.getElementById("myLocationCity");
  let myLocationTemp = document.getElementById("myLocationTemp");
  let myLocationHiLow = document.getElementById("myLocationHiLow");

  listItemContent.style.background = `url(./background-images/${obj.weather[0].icon}.jpg)`;
  listItemContent.style.backgroundRepeat = "no-repeat";
  listItemContent.style.backgroundSize = "cover";
  myLocationCity.innerHTML = `${obj.name}`;
  myLocationTemp.innerHTML = `${Math.round(obj.main.temp)}`;
  myLocationHiLow.innerHTML = `
  <p>H: ${Math.round(obj.main.temp_max)}&deg;</p>
  <p>L: ${Math.round(obj.main.temp_min)}&deg;</p>
  `;
}

const handleDelete = (e) => {
  e.parentElement.remove();
};

const historyClickedItem = (e) => {
  let str = e.getAttribute("data-value");

  latitude = historyObj[`"${str}"`].lat;
  longitude = historyObj[`"${str}"`].lon;
  isMyLocationUsed = false;
  fetchWeather(true);
  closeNav();
  showApiLoader(true);
};

// Main weather api call and functionality: -------------
function showApiLoader(bool) {
  weatherImage.style.display = "none";
  bool
    ? (apiLoader.style.display = "block")
    : (apiLoader.style.display = "none");
}

let isMyLocationUsed = false;
const getWeatherLocation = () => {
  showApiLoader(true);
  weatherCity.innerHTML = "Getting Location...";
  weatherCountry.innerHTML = "";
  const success = (pos) => {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    isMyLocationUsed = true;
    fetchWeather(true);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, errFunction);
  }

  function errFunction() {
    alert("Geocoder failed");
    showApiLoader(false);
    weatherCity.innerHTML = "";
    isMyLocationUsed = false;
  }
};

// main weather function --------------------------
function fetchWeather(bypassHistory) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

  form.reset();

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // changes background image based on weather icon code
      changeBackgroundImage(data);
      showApiLoader(false);

      weatherCountry.innerHTML = `, ${data.sys.country}`;
      weatherCity.innerHTML = data.name;
      weatherInfo.innerHTML = data.weather[0].main;
      weatherImage.style.display = "block";
      weatherImage.src = `./weather-icons/${data.weather[0].icon}.png`;

      currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;`;
      tempHigh.innerHTML = `H: ${Math.round(data.main.temp_max)}&deg;`;
      lowTemp.innerHTML = ` L: ${Math.round(data.main.temp_min)}&deg;`;
      feelsLike.innerHTML = `${Math.round(data.main.feels_like)}&deg;`;
      humidity.innerHTML = `${data.main.humidity}%`;
      windSpeed.innerHTML = Math.round(data.wind.speed);
      cloudPercentage.innerHTML = `${data.clouds.all}%`;

      let pressureConversion = data.main.pressure * 0.02952998597817832; // converts hpa to inHg
      pressure.innerHTML = pressureConversion.toFixed(1);

      let visibilityConversion = data.visibility / 1000 / 1.609;
      weatherVisibility.innerHTML = Math.round(visibilityConversion);

      if (isMyLocationUsed) {
        updateMyLocation(data);
      }
      // does not save to history list if clicked from nav menu
      if (!bypassHistory) {
        updateWeatherHistory(data);
      }
    });

  // forecast api call
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

  fetch(forecastURL)
    .then((response) => response.json())
    .then((data) => {
      // converts list item "dt_txt" to date compatible with new Date() eg June 21, 2022 21:00:00
      const dateConversion = (arr) =>
        `${months[arr.dt_txt.substring(5, 7)]} ${arr.dt_txt.substring(
          8,
          10
        )}, ${arr.dt_txt.substring(0, 4)} ${arr.dt_txt.substring(11)}`;

      //converts current date to compatible format
      let currentDate = new Date().toISOString();
      //e.g. 2022-06-17T00:02:42.257Z

      // should return every date except current
      let filteredResults = data.list.filter((item) => [
        item.dt_txt.substring(0, 10) !== currentDate.substring(0, 10),
      ]);

      // number of days in current month
      let dt = new Date();
      let month = dt.getMonth();
      let year = dt.getFullYear();
      let daysInMonth = new Date(year, month + 1, 0).getDate();

      //isolates forecast results to each date
      let dayNumber = Number(currentDate.substring(8, 10));

      // filters results by day number including towards end of month
      function forecastFilterFunction(item, num) {
        return (
          Number(item.dt_txt.substring(8, 10)) === dayNumber + num ||
          Number(item.dt_txt.substring(8, 10)) === dayNumber + num - daysInMonth
        );
      }
      const forecastDays = [
        {
          day1: filteredResults.filter((item) =>
            forecastFilterFunction(item, 1)
          ),
          day1Low: filteredResults
            .filter((item) => forecastFilterFunction(item, 1))
            .map((temp) => temp.main.temp_min),
          day1High: filteredResults
            .filter((item) => forecastFilterFunction(item, 1))
            .map((temp) => temp.main.temp_max),
        },
        {
          day2: filteredResults.filter((item) =>
            forecastFilterFunction(item, 2)
          ),
          day2Low: filteredResults
            .filter((item) => forecastFilterFunction(item, 2))
            .map((temp) => temp.main.temp_min),
          day2High: filteredResults
            .filter((item) => forecastFilterFunction(item, 2))
            .map((temp) => temp.main.temp_max),
        },
        {
          day3: filteredResults.filter((item) =>
            forecastFilterFunction(item, 3)
          ),
          day3Low: filteredResults
            .filter((item) => forecastFilterFunction(item, 3))
            .map((temp) => temp.main.temp_min),
          day3High: filteredResults
            .filter((item) => forecastFilterFunction(item, 3))
            .map((temp) => temp.main.temp_max),
        },
        {
          day4: filteredResults.filter((item) =>
            forecastFilterFunction(item, 4)
          ),
          day4Low: filteredResults
            .filter((item) => forecastFilterFunction(item, 4))
            .map((temp) => temp.main.temp_min),
          day4High: filteredResults
            .filter((item) => forecastFilterFunction(item, 4))
            .map((temp) => temp.main.temp_max),
        },
        {
          day5: filteredResults.filter((item) =>
            forecastFilterFunction(item, 5)
          ),
          day5Low: filteredResults
            .filter((item) => forecastFilterFunction(item, 5))
            .map((temp) => temp.main.temp_min),
          day5High: filteredResults
            .filter((item) => forecastFilterFunction(item, 5))
            .map((temp) => temp.main.temp_max),
        },
      ]; // displays each forecast day as array of objects

      let minTemps = forecastDays.map((dayOfWeek, index) =>
        Math.round(Math.min(...dayOfWeek[`day${index + 1}Low`]))
      );
      let maxTemps = forecastDays.map((dayOfWeek, index) =>
        Math.round(Math.max(...dayOfWeek[`day${index + 1}High`]))
      );
      //return highest and lowest temp for each day in separate arrays

      //maps through filtered results and displays into forecast div
      //filters results to noon
      forecast.innerHTML = filteredResults
        .filter((time) => time.dt_txt.substring(11) === "12:00:00")
        .map((item, index) => {
          let itemDate = dateConversion(item);

          //converts item date to week number which is used as index to "days" array
          const dayIndex = new Date(itemDate).getDay();

          return `
        <div class="forecast-days">
        <img class='forecast-image' src="./weather-icons/${item.weather[0].icon}.png" alt="weather icon" />
          <p class='forecast-week-day'>${days[dayIndex]}</p>
          
          <p class="forecast-hiLow">H: ${maxTemps[index]}&deg;      L: ${minTemps[index]}&deg;</p>
        </div>
        `;
        })
        .join("");

      // hourly forecast
      let hourlyForecast = [...data.list].slice(0, 9);
      let hourlyContainer = document.getElementById("hourlyContainer");

      const timeConversion = (obj) => {
        let hour = obj.dt_txt.substring(11, 13);
        if (hour === "00" || hour === "12") {
          return "12";
        }
        return Number(hour) % 12;
      };

      const amOrPm = (obj) => {
        let hour = Number(obj.dt_txt.substring(11, 13));
        return hour >= 12 ? "PM" : "AM";
      };

      hourlyContainer.innerHTML = hourlyForecast
        .map((item) => {
          return `
        <div id="hourlyWeatherCard" class="hourlyWeather-card">
        <p class="hourlyTimeOfDay" id="timeOfDay">${timeConversion(
          item
        )} <small>${amOrPm(item)}</small></p>
        <img class='hourly-image' id="hourlyIcon" src="./weather-icons/${
          item.weather[0].icon
        }.png" alt="weather icon" />
        <p class="hourly-temp" id="'hourlyTemp">${Math.round(
          item.main.temp
        )}&deg;</p>
        </div>
        `;
        })
        .join("");
    });
}

window.addEventListener("load", getWeatherLocation);
