const API_KEY = "BR6AJF7FGRGFEBGEAVSAR5BXH";

let currentLocation = "";

async function getWeather(location) {
  currentLocation = location;

  const url =
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Weather data not found");
    }

    const data = await res.json();

    displayCurrentWeather(data);
    displayForecast(data);

  } catch (error) {
    console.error(error);
    alert("Unable to fetch weather.");
  }
}


function displayCurrentWeather(data) {
  const current = data.currentConditions;

  document.getElementById("weatherCard").innerHTML = `
    <h2>${data.address}</h2>
    <p>Temperature: ${current.temp}°C</p>
    <p>Wind Speed: ${current.windspeed} km/h</p>
    <p>Rain Chance: ${current.precipprob || 0}%</p>
    <p>Condition: ${current.conditions}</p>
  `;
}

function displayForecast(data) {
  const forecastContainer =
    document.getElementById("forecast");

  forecastContainer.innerHTML = "";

  const hours = data.days[0].hours.slice(0, 24);

  hours.forEach(hour => {
    const div = document.createElement("div");

    div.className = "hour-card";

    div.innerHTML = `
      <h4>${hour.datetime}</h4>
      <p>${hour.temp}°C</p>
      <p>${hour.conditions}</p>
    `;

    forecastContainer.appendChild(div);
  });
}


document.getElementById("searchBtn")
  .addEventListener("click", () => {
    const location =
      document.getElementById("locationInput").value;

    if (location) {
      getWeather(location);
    }
  });

document.getElementById("refreshBtn")
  .addEventListener("click", () => {
    if (currentLocation) {
      getWeather(currentLocation);
    }
  });


  navigator.geolocation.getCurrentPosition(
  async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getWeather(`${lat},${lon}`);
  },
  () => {
    console.log("Location access denied");
  }
);

