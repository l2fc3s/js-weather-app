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

window.addEventListener("load", () => {
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
        console.log(data);

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
  }
});
