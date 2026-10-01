const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const errorMessage = document.getElementById("errorMessage");


searchButton.addEventListener("click", searchWeather);


async function searchWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city.";
        return;
    }

    errorMessage.textContent = "";

    try {

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            errorMessage.textContent = "City not found.";
            return;
        }

        const location = locationData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        displayWeather(location, weatherData);

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Something went wrong. Please try again.";

    }
}


function displayWeather(location, weatherData) {

    const current = weatherData.current;

    cityName.textContent =
        `${location.name}, ${location.country}`;

    temperature.textContent =
        Math.round(current.temperature_2m);

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    wind.textContent =
        `${current.wind_speed_10m} km/h`;

    condition.textContent =
        getWeatherDescription(current.weather_code);
}


function getWeatherDescription(code) {

    if (code === 0) {
        return "☀️ Clear sky";
    }

    if (code === 1 || code === 2) {
        return "🌤️ Partly cloudy";
    }

    if (code === 3) {
        return "☁️ Overcast";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️ Rain";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️ Rain showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "Unknown";
}
