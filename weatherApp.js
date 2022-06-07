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
        currentTemp.innerHTML = `${Math.round(data.main.temp)}`;
        tempHigh.innerHTML = `${Math.round(data.main.temp_max)} /`;
        lowTemp.innerHTML = ` ${Math.round(data.main.temp_min)}`;
      });
  }
});
