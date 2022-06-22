let bgColorObject = {
  "01d": "to bottom left, #d4fdff, #ffffff",
  "01n": "to bottom left, #413074, #cccbcb",
  "02d": "to bottom left, #ddecec, #ffffff",
  "02n": "to bottom left, #726b8a, #949494",
  "03d": "to bottom left, #cecece, #ffffff",
  "03n": "to bottom left, #646075, #d3d3d3",
  "04d": "to bottom left, #dde5e6, #ffffff",
  "04n": "to bottom left, #63626d, #d3d3d3",
  "09d": "to bottom left, #b7c9cc, #ffffff",
  "09n": "to bottom left, #4d4a5c, #585858",
  "10d": "to bottom left, #9da7a8, #ffffff",
  "10n": "to bottom left, #474552, #3b3b3b",
  "11d": "to bottom left, #777676, #afaeae",
  "11n": "to bottom left, #363347, #2b2a2a",
  "13d": "to bottom left, #ececec, #cecece",
  "13n": "to bottom left, #5c5869, #d3d3d3",
  "50d": "to bottom left, #ececec, #dddddd",
  "50n": "to bottom left, #575764, #7c7c7c",
};

const changeBackgroundImage = (data) => {
  document.body.style.background = `url(./background-images/${data.weather[0].icon}.jpg)`;
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

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
let weatherConditionDisplay = document.getElementById("weatherCondition");
let weatherIcon = document.getElementById("weatherIconContainer");
let forecast = document.getElementById("forecastContainer");

window.addEventListener("load", () => {
  function showApiLoader(bool) {
    bool
      ? (apiLoader.style.display = "block")
      : (apiLoader.style.display = "none");
  }

  function displayWeatherCondition(bool) {
    bool
      ? (weatherConditionDisplay.style.display = "flex")
      : (weatherConditionDisplay.style.display = "none");
  }

  const success = (pos) => {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    fetchWeather();
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, errFunction);
    showApiLoader(true);
  }

  function errFunction() {
    alert("Geocoder failed");
    showApiLoader(false);
  }

  function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //weather data log
        console.log(data);

        // changes background image based on weather icon code
        changeBackgroundImage(data);

        weatherCountry.innerHTML = `, ${data.sys.country}`;
        weatherCity.innerHTML = `${data.name}`;
        weatherInfo.innerHTML = `${data.weather[0].main}`;
        weatherIcon.innerHTML = `<img class='weather-icon' src="./weather-icons/${data.weather[0].icon}.png" alt="weather image"> `;
        currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;`;
        tempHigh.innerHTML = `H: ${Math.round(data.main.temp_max)}&deg;  `;
        lowTemp.innerHTML = ` L: ${Math.round(data.main.temp_min)}&deg;`;

        // Test cases
        // weatherIcon.innerHTML = `<img class='weather-icon' src="./weather icons/02d.png" alt="weather image"> `;
        // document.body.style.background = `linear-gradient(${bgColorObject["02d"]})`;
      });

    // forecast api call
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    fetch(forecastURL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // converts list item "dt_txt" to date compatible with new Date() eg June 21, 2022 21:00:00
        const dateConversion = (arr) =>
          `${months[arr.dt_txt.substring(5, 7)]} ${arr.dt_txt.substring(
            8,
            10
          )}, ${arr.dt_txt.substring(0, 4)} ${arr.dt_txt.substring(11)}`;

        //converts current date to compatible format
        let currentDate = new Date().toISOString();
        console.log(currentDate); //e.g. 2022-06-17T00:02:42.257Z

        // should return every date except current
        let filteredResults = data.list.filter((item) => [
          item.dt_txt.substring(0, 10) !== currentDate.substring(0, 10),
        ]);
        console.log(filteredResults);

        //isolates forecast results to each date
        const forecastDays = [
          {
            day1: filteredResults.filter(
              (item) =>
                item.dt_txt.substring(8, 10) ===
                (Number(currentDate.substring(8, 10)) + 1).toString()
            ),
            day1Low: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 1).toString()
              )
              .map((temp) => temp.main.temp_min),
            day1High: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 1).toString()
              )
              .map((temp) => temp.main.temp_max),
          },
          {
            day2: filteredResults.filter(
              (item) =>
                item.dt_txt.substring(8, 10) ===
                (Number(currentDate.substring(8, 10)) + 2).toString()
            ),
            day2Low: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 2).toString()
              )
              .map((temp) => temp.main.temp_min),
            day2High: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 2).toString()
              )
              .map((temp) => temp.main.temp_max),
          },
          {
            day3: filteredResults.filter(
              (item) =>
                item.dt_txt.substring(8, 10) ===
                (Number(currentDate.substring(8, 10)) + 3).toString()
            ),
            day3Low: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 3).toString()
              )
              .map((temp) => temp.main.temp_min),
            day3High: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 3).toString()
              )
              .map((temp) => temp.main.temp_max),
          },
          {
            day4: filteredResults.filter(
              (item) =>
                item.dt_txt.substring(8, 10) ===
                (Number(currentDate.substring(8, 10)) + 4).toString()
            ),
            day4Low: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 4).toString()
              )
              .map((temp) => temp.main.temp_min),
            day4High: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 4).toString()
              )
              .map((temp) => temp.main.temp_max),
          },
          {
            day5: filteredResults.filter(
              (item) =>
                item.dt_txt.substring(8, 10) ===
                (Number(currentDate.substring(8, 10)) + 5).toString()
            ),
            day5Low: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 5).toString()
              )
              .map((temp) => temp.main.temp_min),
            day5High: filteredResults
              .filter(
                (item) =>
                  item.dt_txt.substring(8, 10) ===
                  (Number(currentDate.substring(8, 10)) + 5).toString()
              )
              .map((temp) => temp.main.temp_max),
          },
        ];
        console.log(forecastDays); // displays each forecast day as array of objects

        let minTemps = forecastDays.map((dayOfWeek, index) =>
          Math.round(Math.min(...dayOfWeek[`day${index + 1}Low`]))
        );
        let maxTemps = forecastDays.map((dayOfWeek, index) =>
          Math.round(Math.max(...dayOfWeek[`day${index + 1}High`]))
        );
        console.log(maxTemps); //  return highest temp for each day in array
        console.log(minTemps); //  return lowest temp for each day in array

        //maps through filtered results and displays into forecast div
        //filters results to noon
        forecast.innerHTML = filteredResults
          .filter((time) => time.dt_txt.substring(11) === "12:00:00")
          .map((item, index) => {
            let itemDate = dateConversion(item);

            //converts item date to week number which is used as index to "days" array
            const dayIndex = new Date(itemDate).getDay();

            return `
          <ul class="forecast-list">
          <li class="forecast-days">
            <p class='forecast-week-day'>${days[dayIndex]}</p>
            <img class='forecast-image' src="./weather-icons/${item.weather[0].icon}.png" alt="weather icon" />
            <p class="forecast-hiLow">H: ${maxTemps[index]}</p>
            <p class="forecast-hiLow">  L: ${minTemps[index]}</p>
          </li>
        </ul>
          `;
          })
          .join("");
      });
  }
});
