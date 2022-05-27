window.addEventListener("load", () => {
  let latitude;
  let longitude;
  const apiKey = "eee3276fd98cb728fa9c4303282c4b36";

  const success = (pos) => {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    fetchWeather();
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, errFunction);
  }

  function errFunction() {
    alert("Geocoder failed");
  }

  function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(url).then((response) => response.json().then(console.log));
  }
});
