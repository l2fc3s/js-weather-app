window.addEventListener("load", () => {
  let latitude;
  let longitude;
  const apiKey = "eee3276fd98cb728fa9c4303282c4b36";
  let weatherCity = document.getElementById("weatherHeader");
  let weatherInfo = document.getElementById("weatherCondition");
  let currentTemp = document.getElementById("weatherTemp");
  let tempHigh = document.getElementById("weatherHigh");
  let lowTemp = document.getElementById("weatherLow");
  let apiLoader = document.getElementById("apiLoader");

  const success = (pos) => {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    fetchWeather();
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, errFunction);
    apiLoader.style.display = "block";
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
        apiLoader.style.display = "none";

        weatherCity.innerHTML = `${data.name}`;
        weatherInfo.innerHTML = `${data.weather[0].main}`;
        currentTemp.innerHTML = `${Math.round(data.main.temp)}`;
        tempHigh.innerHTML = `${Math.round(data.main.temp_max)} /`;
        lowTemp.innerHTML = ` ${Math.round(data.main.temp_min)}`;
      });
  }
});
