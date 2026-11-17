const API_KEY = "BR6AJF7FGRGFEBGEAVSAR5BXH";

let currentLocation = "";
let chart = null;

const loader = document.getElementById("loader");

async function getWeather(location) {

  currentLocation = location;

  localStorage.setItem(
    "lastLocation",
    location
  );

  const url =
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  loader.classList.remove("hidden");

  try {

    const res = await fetch(url);

    if(!res.ok){
      throw new Error();
    }

    const data = await res.json();

    displayCurrentWeather(data);

    displayForecast(data);

    displayWeeklyForecast(data);

    createChart(data);

  }

  catch(error){

    document.getElementById("weatherCard").innerHTML = `
      <div class="error">
        Location not found.
      </div>
    `;

    console.error(error);

  }

  finally{
    loader.classList.add("hidden");
  }
}

function displayCurrentWeather(data){

  const current =
    data.currentConditions;

  document.getElementById(
    "weatherCard"
  ).innerHTML = `

    <h2>${data.address}</h2>

    <h3>${current.temp}°C</h3>

    <p>${current.conditions}</p>

    <div class="stats">

      <div class="stat">
        <h3>${current.windspeed}</h3>
        <p>Wind km/h</p>
      </div>

      <div class="stat">
        <h3>${current.humidity}%</h3>
        <p>Humidity</p>
      </div>

      <div class="stat">
        <h3>${current.precipprob || 0}%</h3>
        <p>Rain Chance</p>
      </div>

      <div class="stat">
        <h3>${current.pressure}</h3>
        <p>Pressure</p>
      </div>

    </div>
  `;
}

function displayForecast(data){

  const forecast =
    document.getElementById("forecast");

  forecast.innerHTML = "";

  const hours =
    data.days[0].hours.slice(0,24);

  hours.forEach(hour => {

    const div =
      document.createElement("div");

    div.className = "hour-card";

    div.innerHTML = `
      <h4>${hour.datetime}</h4>
      <p>${hour.temp}°C</p>
      <p>${hour.conditions}</p>
    `;

    forecast.appendChild(div);

  });
}

function displayWeeklyForecast(data){

  const container =
    document.getElementById(
      "weekForecast"
    );

  container.innerHTML = "";

  data.days.slice(0,7).forEach(day => {

    const card =
      document.createElement("div");

    card.className = "day-card";

    card.innerHTML = `
      <h4>${day.datetime}</h4>
      <p>${day.temp}°C</p>
      <p>${day.conditions}</p>
    `;

    container.appendChild(card);

  });
}

function createChart(data){

  const hours =
    data.days[0].hours.slice(0,24);

  const labels =
    hours.map(h => h.datetime);

  const temps =
    hours.map(h => h.temp);

  const ctx =
    document
      .getElementById("tempChart");

  if(chart){
    chart.destroy();
  }

  chart = new Chart(ctx,{

    type:"line",

    data:{
      labels,

      datasets:[{
        label:"Temperature °C",
        data:temps,
        fill:false
      }]
    }
  });
}

document
.getElementById("searchBtn")
.addEventListener("click", () => {

  const location =
    document.getElementById(
      "locationInput"
    ).value;

  if(location){
    getWeather(location);
  }

});

document
.getElementById("refreshBtn")
.addEventListener("click", () => {

  if(currentLocation){
    getWeather(currentLocation);
  }

});

document
.getElementById("themeBtn")
.addEventListener("click", () => {

  document.body.classList.toggle(
    "light"
  );

});

const lastLocation =
  localStorage.getItem(
    "lastLocation"
  );

if(lastLocation){
  getWeather(lastLocation);
}

navigator.geolocation.getCurrentPosition(

  position => {

    const lat =
      position.coords.latitude;

    const lon =
      position.coords.longitude;

    getWeather(`${lat},${lon}`);

  },

  () => {

    console.log(
      "Location permission denied"
    );

  }

);

setInterval(() => {

  if(currentLocation){

    getWeather(
      currentLocation
    );

  }

},300000);