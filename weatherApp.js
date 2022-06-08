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
    if (bool) {
      apiLoader.style.display = "block";
    } else {
      apiLoader.style.display = "none";
    }
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
    displayWeatherCondition(false);
  }

  function errFunction() {
    alert("Geocoder failed");
    showApiLoader(false);
    displayWeatherCondition(true);
  }

  function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        showApiLoader(false);
        displayWeatherCondition(true);

        weatherCountry.innerHTML = `, ${data.sys.country}`;
        weatherCity.innerHTML = `${data.name}`;
        weatherInfo.innerHTML = `${data.weather[0].main}`;
        weatherIcon.innerHTML = `<img class='weather-icon' src="./weather icons/${data.weather[0].icon}.png" alt="weather image"> `;
        currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;`;
        tempHigh.innerHTML = `${Math.round(data.main.temp_max)}&deg; /`;
        lowTemp.innerHTML = ` ${Math.round(data.main.temp_min)}&deg;`;
      });
  }
});
