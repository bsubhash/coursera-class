// Update Date and Time
const updateDateTime = () => {
    const today = new Date();
    // Date Settings
    const day = today.toLocaleDateString(today, { weekday: "short" });
    const date = today.getDate();
    const month = today.toLocaleDateString(today, { month: "short" });
    const year = today.getFullYear();

    const $date = day + ", " + date + " " + month + " " + year;
    // Ensure 'date' element exists in your HTML
    const dateElement = document.getElementById("date");
    if (dateElement) {
        dateElement.textContent = $date;
    } else {
        console.error("Element with id 'date' not found.");
    }


    // Time Setting
    var hours = today.getHours();
    var minutes = today.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    if (hours > 12) {
        hours = hours - 12;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    const strTime = hours + ":" + minutes;

    // Ensure 'time' and 'ampm' elements exist in your HTML
    const timeElement = document.getElementById("time");
    const ampmElement = document.getElementById("ampm");
    if (timeElement) {
        timeElement.textContent = strTime;
    } else {
        console.error("Element with id 'time' not found.");
    }
    if (ampmElement) {
        ampmElement.textContent = ampm;
    } else {
        console.error("Element with id 'ampm' not found.");
    }
};

// Update time every second
updateDateTime();
setInterval(updateDateTime, 1000);

const API_KEY = "14d31962c93bbd59c7b96fab3aeabcb4"; // API key for OpenWeatherMap API

/**
 * Fetches location data (latitude and longitude) from a specified REST API.
 * This replaces the use of navigator.geolocation.
 * @returns {Promise<{latitude: number, longitude: number}|null>} A promise that resolves
 * with an object containing latitude and longitude, or null if an error occurs.
 */
async function fetchLocationFromAPI() {
    const url = "https://larixtuner.softvelum.com/api/v1/public/remote_control/68331d014a5a79efcad1d6b6/location/?client_id=3bfe9dcf-756f-4a19-8384-ccdd8181e522&api_key=3fb5de68bd4f27de4efa00e65cfa59d8";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
        }

        const data = await response.json();

        if (data.status === "ok" && data.location && typeof data.location.lat === 'number' && typeof data.location.lng === 'number') {
            const latitude = data.location.lat;
            const longitude = data.location.lng;
            console.log("Fetched Latitude (from API):", latitude);
            console.log("Fetched Longitude (from API):", longitude);
            return { latitude, longitude };
        } else {
            console.error("API response status is not 'ok' or location data is missing/invalid:", data);
            return null;
        }

    } catch (error) {
        console.error("Error fetching location data from API:", error);
        return null;
    }
}

// Get local Location And Weather Details
const getWeatherDetails = async () => { // Made this function async
    const locationCoords = await fetchLocationFromAPI(); // Get coordinates from the new API function

    if (!locationCoords) {
        console.error("Could not get location from API. Cannot fetch weather details.");
        // You might want to update a UI element here to inform the user
        // document.getElementById("location").textContent = "Location Unavailable";
        return; // Exit if location is not available
    }

    const { latitude, longitude } = locationCoords; // Destructure latitude and longitude

    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

    fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
            // Location Details
            const locationElement = document.getElementById("location");
            if (locationElement) {
                locationElement.textContent = data.name + ", " + data.sys.country;
            } else {
                console.error("Element with id 'location' not found.");
            }

            // Weather Conditions
            const currentWeatherCondition = data.weather[0].main;
            const weatherConditionsElement = document.getElementById("weather-conditions");
            if (weatherConditionsElement) {
                if (currentWeatherCondition == "Clouds") {
                    weatherConditionsElement.innerHTML =
                        '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 68.52" style="enable-background:new 0 0 122.88 68.52" xml:space="preserve"><g><path d="M52.33,11.39c2.21-3.14,4.99-5.64,8.11-7.49c3.65-2.17,7.77-3.44,11.97-3.8c5.89-0.5,11.96,0.79,17.18,3.92 c4.25,2.55,7.9,6.31,10.41,11.29c1.18-0.19,2.37-0.28,3.55-0.27c4.98,0.03,9.78,1.82,13.56,5.89c0.79,0.85,1.54,1.82,2.24,2.89 c2.37,3.65,3.59,8.52,3.53,13.28c-0.05,4.67-1.32,9.33-3.89,12.76c-1.68,2.23-3.84,4.05-6.42,5.5c-2.49,1.4-5.39,2.45-8.66,3.21 l-0.61,0.07H87.93c-0.21,0.33-0.46,0.69-0.76,1.09c-1.68,2.23-3.84,4.05-6.42,5.5c-2.49,1.4-5.39,2.45-8.66,3.21l-0.61,0.07H17.33 l-0.34-0.03c-1.98-0.25-3.78-0.72-5.4-1.39c-1.67-0.69-3.16-1.59-4.48-2.69H7.1c-1.24-1.04-2.33-2.22-3.26-3.5 C1.37,57.5,0.03,53.33,0,49.18c-0.03-4.19,1.28-8.37,4.09-11.75c0.91-1.1,1.98-2.1,3.21-2.99c1.43-1.04,3.07-1.91,4.92-2.63 c1.28-0.5,2.63-0.91,4.08-1.24c0.61-2.45,1.49-4.67,2.58-6.68c3-5.53,7.61-9.45,12.9-11.71c5.23-2.24,11.12-2.85,16.73-1.78 C49.8,10.64,51.08,10.97,52.33,11.39L52.33,11.39z M63.2,8.59c-2.19,1.3-4.17,3-5.8,5.09c2.42,1.4,4.66,3.21,6.64,5.42 c1.59,1.78,2.99,3.81,4.14,6.09c3.19-0.5,6.42-0.33,9.44,0.66c3.81,1.25,7.27,3.77,9.92,7.85c2.09,3.21,3.28,7.36,3.5,11.55 c0.14,2.68-0.11,5.4-0.79,7.94h12.76c2.62-0.63,4.93-1.48,6.89-2.58c1.95-1.09,3.54-2.42,4.74-4.01c1.85-2.47,2.76-5.96,2.8-9.54 c0.04-3.76-0.87-7.53-2.66-10.27c-0.51-0.79-1.07-1.5-1.67-2.14c-2.67-2.88-6.07-4.14-9.6-4.16c-2.56-0.02-5.2,0.6-7.71,1.71 c-0.56,0.27-1.12,0.58-1.67,0.9c-1.67,0.98-3.32,2.17-4.99,3.54l-3.58-4.11c1.24-1.15,2.58-2.2,4-3.12 c1.14-0.74,2.32-1.4,3.54-1.96c0.49-0.24,0.98-0.47,1.48-0.69c-1.99-3.51-4.7-6.19-7.8-8.05c-4.2-2.52-9.13-3.56-13.94-3.15 C69.45,5.84,66.14,6.86,63.2,8.59L63.2,8.59z M83.81,54.9c0.06-0.14,0.12-0.27,0.2-0.4c1.24-2.59,1.75-5.79,1.58-8.97 c-0.17-3.28-1.07-6.47-2.63-8.87c-1.92-2.94-4.36-4.75-7.04-5.63c-3.06-1.01-6.47-0.84-9.75,0.2c-0.77,0.24-1.53,0.54-2.28,0.88 c-0.71,0.35-1.41,0.74-2.11,1.17c-1.46,0.9-2.93,1.98-4.45,3.23l-3.58-4.11c1.56-1.45,3.28-2.73,5.09-3.8 c0.84-0.5,1.71-0.95,2.6-1.36c0.44-0.22,0.89-0.43,1.34-0.62c-0.82-1.45-1.75-2.75-2.78-3.9c-1.7-1.91-3.7-3.45-5.87-4.63 c-2.09-1.14-4.33-1.92-6.61-2.35c-4.57-0.87-9.35-0.38-13.59,1.44c-4.19,1.8-7.85,4.91-10.23,9.3c-1.1,2.04-1.94,4.34-2.42,6.9 l-0.35,1.86l-1.85,0.33c-1.82,0.32-3.44,0.76-4.86,1.31c-1.38,0.54-2.61,1.19-3.68,1.97c-0.86,0.62-1.6,1.32-2.23,2.07 c-1.95,2.34-2.86,5.27-2.83,8.23c0.02,3.01,1,6.05,2.81,8.55c0.67,0.93,1.45,1.78,2.34,2.52l0,0.01c0.89,0.74,1.91,1.36,3.06,1.83 c1.13,0.47,2.39,0.8,3.77,1H71.2c2.62-0.63,4.93-1.48,6.89-2.58c1.95-1.09,3.54-2.42,4.74-4.01c0.16-0.21,0.35-0.49,0.56-0.84 C83.55,55.35,83.7,55.11,83.81,54.9L83.81,54.9z" fill="#000000"/></g></svg>';
                } else if (currentWeatherCondition == "Fog") {
                    weatherConditionsElement.innerHTML =
                        '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 104.36" style="enable-background:new 0 0 122.88 104.36" xml:space="preserve"><g><path d="M47.07,96.74c1.83,0,3.32,1.65,3.32,3.68c0,2.03-1.48,3.68-3.32,3.68h-9.35c-1.83,0-3.32-1.65-3.32-3.68 c0-2.03,1.48-3.68,3.32-3.68H47.07L47.07,96.74z M14.3,67.94c1.56,1.3,1.76,3.62,0.46,5.18c-1.3,1.56-3.62,1.76-5.18,0.46 c-1.68-1.4-3.15-2.99-4.4-4.72C1.84,64.25,0.04,58.63,0,53.03c-0.04-5.66,1.72-11.29,5.52-15.85c1.23-1.48,2.68-2.84,4.34-4.04 c1.93-1.4,4.14-2.58,6.64-3.55c1.72-0.67,3.56-1.23,5.5-1.68c2.2-8.74,6.89-15.47,12.92-20.14c5.64-4.37,12.43-6.92,19.42-7.59 c6.96-0.67,14.12,0.51,20.55,3.6c7.02,3.37,13.14,8.98,17.11,16.87c1.6-0.25,3.2-0.38,4.79-0.36c6.72,0.05,13.2,2.45,18.3,7.95 c1.07,1.15,2.08,2.45,3.02,3.9c3.2,4.92,4.84,11.49,4.77,17.92c-0.07,6.31-1.77,12.59-5.25,17.22c-1.22,1.62-3.52,1.95-5.14,0.73 c-1.62-1.22-1.95-3.52-0.73-5.14c2.5-3.33,3.73-8.04,3.78-12.87c0.06-5.07-1.18-10.16-3.59-13.86c-0.69-1.07-1.45-2.03-2.25-2.89 c-3.61-3.89-8.19-5.59-12.95-5.62c-3.46-0.02-7.02,0.81-10.41,2.31c-0.75,0.37-1.5,0.77-2.25,1.21c-2.25,1.32-4.47,2.93-6.74,4.78 l-4.84-5.54c1.67-1.55,3.48-2.96,5.4-4.21c1.53-1,3.13-1.88,4.77-2.65c0.66-0.33,1.33-0.64,2-0.93c-3.19-5.65-7.78-9.7-12.98-12.2 c-5.2-2.49-11.02-3.45-16.69-2.9c-5.63,0.54-11.1,2.59-15.62,6.1c-5.23,4.06-9.2,10.11-10.73,18.14l-0.48,2.51l-2.5,0.44 c-2.45,0.43-4.64,1.02-6.56,1.77c-1.86,0.72-3.52,1.61-4.97,2.66c-1.16,0.84-2.16,1.78-3.01,2.8c-2.63,3.15-3.85,7.1-3.82,11.1 c0.03,4.06,1.35,8.16,3.79,11.53C12.04,65.79,13.1,66.94,14.3,67.94L14.3,67.94z M32.27,72.03c-1.49,0-2.69-1.65-2.69-3.68 c0-2.03,1.2-3.68,2.69-3.68h66.56c1.49,0,2.69,1.65,2.69,3.68c0,2.03-1.2,3.68-2.69,3.68H32.27L32.27,72.03z M20.38,87.54 c-1.83,0-3.32-1.65-3.32-3.68s1.48-3.68,3.32-3.68H72.9c1.83,0,3.32,1.65,3.32,3.68s-1.48,3.68-3.32,3.68H20.38L20.38,87.54z M89.4,87.54c-1.83,0-3.32-1.65-3.32-3.68s1.48-3.68,3.32-3.68h11.82c1.83,0,3.32,1.65,3.32,3.68s-1.48,3.68-3.32,3.68H89.4 L89.4,87.54z M109.27,97.03c1.82,0.01,3.3,1.66,3.29,3.68c-0.01,2.03-1.49,3.66-3.32,3.66l-46.97-0.27 c-1.82-0.01-3.3-1.66-3.29-3.68c0.01-2.03,1.49-3.66,3.32-3.66L109.27,97.03L109.27,97.03z" fill="#000000"/></g></svg>';
                } else if (currentWeatherCondition == "Snow") {
                    weatherConditionsElement.innerHTML =
                        '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 122.88" style="enable-background:new 0 0 122.88 122.88" xml:space="preserve"><g><path d="M54.38,36.39L36.9,20.42c-2.88-2.62-3.06-7.08-0.44-9.95c2.62-2.88,7.08-3.06,9.95-0.44l7.96,7.26l0-10.21 c0-3.91,3.17-7.08,7.08-7.08c3.91,0,7.08,3.17,7.08,7.08v10.88L77.9,9.4c2.88-2.62,7.34-2.43,9.95,0.44 c2.62,2.88,2.43,7.34-0.44,9.95L68.54,37.05v17.29h17.18l16.81-18.4c2.62-2.88,7.08-3.06,9.95-0.44c2.88,2.62,3.06,7.08,0.44,9.95 l-8.11,8.89h10.99c3.91,0,7.08,3.17,7.08,7.08s-3.17,7.08-7.08,7.08h-9.99l7.74,8.44c2.62,2.88,2.43,7.34-0.44,9.95 c-2.88,2.62-7.34,2.43-9.95-0.44L86.71,68.5l-18.18,0v17.59l18.88,17.25c2.88,2.62,3.06,7.08,0.44,9.95 c-2.62,2.88-7.08,3.06-9.95,0.44l-9.36-8.55v10.62c0,3.91-3.17,7.08-7.08,7.08c-3.91,0-7.08-3.17-7.08-7.08v-9.95l-7.96,7.26 c-2.88,2.62-7.34,2.43-9.95-0.44c-2.62-2.88-2.43-7.34,0.44-9.95l17.48-15.96V68.5H36.9L20.46,86.45 c-2.62,2.88-7.08,3.06-9.95,0.44s-3.06-7.08-0.44-9.95l7.74-8.44l-10.73,0C3.17,68.5,0,65.33,0,61.42s3.17-7.08,7.08-7.08H18.8 l-8.11-8.89c-2.62-2.88-2.43-7.34,0.44-9.95c2.88-2.62,7.34-2.43,9.95,0.44l16.81,18.4h16.48V36.39L54.38,36.39z" fill="#000000" /></g></svg>';
                } else if (currentWeatherCondition == "Rain") {
                    weatherConditionsElement.innerHTML =
                        '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 114.13" style="enable-background:new 0 0 122.88 114.13" xml:space="preserve"><g><path d="M39.5,97.74c0.41-2.14,2.47-3.54,4.61-3.13c2.14,0.41,3.54,2.47,3.13,4.61l-1.35,6.99c-0.41,2.14-2.47,3.54-4.61,3.13 c-2.14-0.41-3.54-2.47-3.13-4.61L39.5,97.74L39.5,97.74z M23.84,71.8c2.01,0.25,3.43,2.09,3.18,4.1s-2.09,3.43-4.1,3.18 c-2.67-0.34-5.09-0.97-7.29-1.88c-2.27-0.94-4.28-2.15-6.05-3.63c-1.68-1.4-3.15-2.99-4.4-4.72C1.84,64.25,0.04,58.63,0,53.03 c-0.04-5.66,1.72-11.29,5.52-15.85c1.23-1.48,2.68-2.84,4.34-4.04c1.93-1.4,4.14-2.58,6.64-3.55c1.72-0.67,3.56-1.23,5.5-1.68 c2.2-8.74,6.89-15.47,12.92-20.14c5.64-4.37,12.43-6.92,19.42-7.59c6.96-0.67,14.12,0.51,20.55,3.6 c7.02,3.37,13.14,8.98,17.11,16.87c1.6-0.25,3.2-0.38,4.79-0.36c6.72,0.05,13.2,2.45,18.3,7.95c1.07,1.15,2.08,2.45,3.02,3.9 c3.2,4.92,4.84,11.49,4.77,17.92c-0.07,6.31-1.77,12.59-5.25,17.22c-2.27,3.01-5.18,5.47-8.67,7.42 c-3.36,1.88-7.28,3.31-11.68,4.33c-1.98,0.45-3.95-0.78-4.4-2.76c-0.45-1.98,0.78-3.95,2.76-4.4c3.71-0.86,6.97-2.04,9.72-3.58 c2.63-1.47,4.78-3.26,6.39-5.41c2.5-3.33,3.73-8.04,3.78-12.87c0.06-5.07-1.18-10.16-3.59-13.86c-0.69-1.06-1.45-2.03-2.25-2.89 c-3.61-3.89-8.19-5.59-12.95-5.62c-3.46-0.02-7.02,0.81-10.41,2.31c-0.75,0.37-1.5,0.77-2.25,1.21c-2.25,1.32-4.47,2.93-6.74,4.78 l-4.84-5.54c1.67-1.55,3.48-2.96,5.4-4.21c1.53-1,3.13-1.88,4.77-2.65c0.66-0.33,1.33-0.64,2-0.93c-3.19-5.65-7.78-9.7-12.98-12.2 c-5.2-2.49-11.02-3.45-16.69-2.9c-5.63,0.54-11.1,2.59-15.62,6.1c-5.23,4.06-9.2,10.11-10.73,18.14l-0.48,2.51l-2.5,0.44 c-2.45,0.43-4.64,1.02-6.56,1.77c-1.86,0.72-3.52,1.61-4.97,2.66c-1.16,0.84-2.16,1.78-3.01,2.8c-2.63,3.15-3.85,7.1-3.82,11.1 c0.03,4.06,1.35,8.16,3.79,11.53c0.91,1.25,1.96,2.4,3.16,3.4c1.22,1.01,2.59,1.84,4.13,2.48C20.03,71.08,21.84,71.55,23.84,71.8 L23.84,71.8z M39.91,53.78c0.41-2.14,2.47-3.54,4.61-3.13c2.14,0.41,3.54,2.47,3.13,4.61l-1.35,6.99 c-0.41,2.14-2.47,3.54-4.61,3.13c-2.14-0.41-3.54-2.47-3.13-4.61L39.91,53.78L39.91,53.78z M60.78,57.39 c0.41-2.14,2.47-3.54,4.61-3.13c2.14,0.41,3.54,2.47,3.13,4.61l-1.35,6.99c-0.41,2.14-2.47,3.54-4.61,3.13 c-2.14-0.41-3.54-2.47-3.13-4.61L60.78,57.39L60.78,57.39z M80.7,62.92c0.41-2.14,2.47-3.54,4.61-3.13 c2.14,0.41,3.54,2.47,3.13,4.61l-1.35,6.99c-0.41,2.14-2.47,3.54-4.61,3.13c-2.14-0.41-3.54-2.47-3.13-4.61L80.7,62.92L80.7,62.92z M75.32,84.99c0.41-2.14,2.47-3.54,4.61-3.13c2.14,0.41,3.54,2.47,3.13,4.61l-1.35,6.99C81.3,95.6,79.24,97,77.1,96.59 c-2.14-0.41-3.54-2.47-3.13-4.61L75.32,84.99L75.32,84.99z M54.82,80.26c0.41-2.14,2.47-3.54,4.61-3.13 c2.14,0.41,3.54,2.47,3.13,4.61l-1.35,6.99c-0.41,2.14-2.47,3.54-4.61,3.13c-2.14-0.41-3.54-2.47-3.13-4.61L54.82,80.26 L54.82,80.26z M35.22,75.53c0.41-2.14,2.47-3.54,4.61-3.13c2.14,0.41,3.54,2.47,3.13,4.61L41.61,84c-0.41,2.14-2.47,3.54-4.61,3.13 c-2.14-0.41-3.54-2.47-3.13-4.61L35.22,75.53L35.22,75.53z M59.1,102.46c0.41-2.14,2.47-3.54,4.61-3.13 c2.14,0.41,3.54,2.47,3.13,4.61l-1.35,6.99c-0.41,2.14-2.47,3.54-4.61,3.13c-2.14-0.41-3.54-2.47-3.13-4.61L59.1,102.46 L59.1,102.46z" fill="#000000"/></g></svg>';
                } else if (currentWeatherCondition == "Thunderstorm") {
                    weatherConditionsElement.innerHTML =
                        '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 116.82" style="enable-background:new 0 0 122.88 116.82" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M59.63,61.55h22.58l-7.87,15.24l13.4,0.24l-32.64,39.8l6.28-26.18H50.81L59.63,61.55L59.63,61.55z M44.2,71.76 c2.03,0,3.68,1.65,3.68,3.68c0,2.03-1.65,3.68-3.68,3.68H23.38l-0.46-0.04c-2.67-0.34-5.09-0.97-7.29-1.88 c-2.25-0.93-4.26-2.14-6.04-3.63H9.58c-1.68-1.4-3.15-2.99-4.4-4.72C1.84,64.25,0.04,58.63,0,53.03 c-0.04-5.66,1.72-11.29,5.52-15.85c1.23-1.48,2.68-2.84,4.34-4.04c1.93-1.4,4.14-2.58,6.64-3.55c1.72-0.67,3.56-1.23,5.5-1.68 c2.2-8.74,6.89-15.47,12.92-20.14c5.64-4.37,12.43-6.92,19.42-7.59c6.96-0.67,14.12,0.51,20.55,3.6 c7.37,3.54,13.43,9.56,17.11,16.87c1.6-0.25,3.2-0.38,4.79-0.36c6.72,0.05,13.2,2.45,18.3,7.95c5.31,5.72,7.88,14.14,7.79,21.82 c-0.07,6.31-1.77,12.59-5.25,17.22c-2.27,3.02-5.18,5.47-8.67,7.42c-3.36,1.88-7.28,3.31-11.68,4.33c-1.98,0.45-3.95-0.78-4.4-2.76 c-0.45-1.98,0.78-3.95,2.76-4.4c3.71-0.86,6.97-2.04,9.72-3.58c2.63-1.47,4.78-3.26,6.39-5.41c2.5-3.33,3.73-8.04,3.78-12.87 c0.06-5.07-1.18-10.16-3.59-13.86c-0.69-1.07-1.44-2.03-2.25-2.89c-3.61-3.89-8.19-5.59-12.95-5.62 c-3.46-0.02-7.02,0.81-10.41,2.31c-0.75,0.37-1.51,0.78-2.25,1.21c-2.25,1.32-4.48,2.93-6.74,4.78l-4.84-5.54 c1.67-1.55,3.48-2.96,5.4-4.21c1.53-1,3.13-1.88,4.77-2.65c0.66-0.33,1.33-0.64,2-0.93c-3.19-5.65-7.78-9.7-12.98-12.2 c-5.2-2.49-11.02-3.45-16.69-2.9c-5.63,0.54-11.1,2.59-15.62,6.1c-5.23,4.06-9.2,10.11-10.73,18.14l-0.48,2.51l-2.5,0.44 c-2.45,0.43-4.64,1.02-6.56,1.77c-1.86,0.72-3.52,1.61-4.97,2.66c-1.16,0.84-2.16,1.78-3.01,2.8c-2.63,3.15-3.85,7.1-3.82,11.1 c0.03,4.06,1.35,8.16,3.79,11.53c0.91,1.25,1.96,2.4,3.16,3.4l-0.01,0.01c1.2,1,2.58,1.83,4.13,2.47c1.53,0.63,3.22,1.08,5.09,1.34 H44.2L44.2,71.76z M57.07,85.6l6.59-18.76h10.23l-5.32,14.28l8.03,0.14l-13.51,20.22l4.03-15.88H57.07L57.07,85.6z" fill="#000000"/></g></svg>';
                } else {
                    weatherConditionsElement.innerHTML =
                        '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 68.52" style="enable-background:new 0 0 122.88 68.52" xml:space="preserve"><g><path d="M52.33,11.39c2.21-3.14,4.99-5.64,8.11-7.49c3.65-2.17,7.77-3.44,11.97-3.8c5.89-0.5,11.96,0.79,17.18,3.92 c4.25,2.55,7.9,6.31,10.41,11.29c1.18-0.19,2.37-0.28,3.55-0.27c4.98,0.03,9.78,1.82,13.56,5.89c0.79,0.85,1.54,1.82,2.24,2.89 c2.37,3.65,3.59,8.52,3.53,13.28c-0.05,4.67-1.32,9.33-3.89,12.76c-1.68,2.23-3.84,4.05-6.42,5.5c-2.49,1.4-5.39,2.45-8.66,3.21 l-0.61,0.07H87.93c-0.21,0.33-0.46,0.69-0.76,1.09c-1.68,2.23-3.84,4.05-6.42,5.5c-2.49,1.4-5.39,2.45-8.66,3.21l-0.61,0.07H17.33 l-0.34-0.03c-1.98-0.25-3.78-0.72-5.4-1.39c-1.67-0.69-3.16-1.59-4.48-2.69H7.1c-1.24-1.04-2.33-2.22-3.26-3.5 C1.37,57.5,0.03,53.33,0,49.18c-0.03-4.19,1.28-8.37,4.09-11.75c0.91-1.1,1.98-2.1,3.21-2.99c1.43-1.04,3.07-1.91,4.92-2.63 c1.28-0.5,2.63-0.91,4.08-1.24c0.61-2.45,1.49-4.67,2.58-6.68c3-5.53,7.61-9.45,12.9-11.71c5.23-2.24,11.12-2.85,16.73-1.78 C49.8,10.64,51.08,10.97,52.33,11.39L52.33,11.39z M63.2,8.59c-2.19,1.3-4.17,3-5.8,5.09c2.42,1.4,4.66,3.21,6.64,5.42 c1.59,1.78,2.99,3.81,4.14,6.09c3.19-0.5,6.42-0.33,9.44,0.66c3.81,1.25,7.27,3.77,9.92,7.85c2.09,3.21,3.28,7.36,3.5,11.55 c0.14,2.68-0.11,5.4-0.79,7.94h12.76c2.62-0.63,4.93-1.48,6.89-2.58c1.95-1.09,3.54-2.42,4.74-4.01c1.85-2.47,2.76-5.96,2.8-9.54 c0.04-3.76-0.87-7.53-2.66-10.27c-0.51-0.79-1.07-1.5-1.67-2.14c-2.67-2.88-6.07-4.14-9.6-4.16c-2.56-0.02-5.2,0.6-7.71,1.71 c-0.56,0.27-1.12,0.58-1.67,0.9c-1.67,0.98-3.32,2.17-4.99,3.54l-3.58-4.11c1.24-1.15,2.58-2.2,4-3.12 c1.14-0.74,2.32-1.4,3.54-1.96c0.49-0.24,0.98-0.47,1.48-0.69c-1.99-3.51-4.7-6.19-7.8-8.05c-4.2-2.52-9.13-3.56-13.94-3.15 C69.45,5.84,66.14,6.86,63.2,8.59L63.2,8.59z M83.81,54.9c0.06-0.14,0.12-0.27,0.2-0.4c1.24-2.59,1.75-5.79,1.58-8.97 c-0.17-3.28-1.07-6.47-2.63-8.87c-1.92-2.94-4.36-4.75-7.04-5.63c-3.06-1.01-6.47-0.84-9.75,0.2c-0.77,0.24-1.53,0.54-2.28,0.88 c-0.71,0.35-1.41,0.74-2.11,1.17c-1.46,0.9-2.93,1.98-4.45,3.23l-3.58-4.11c1.56-1.45,3.28-2.73,5.09-3.8 c0.84-0.5,1.71-0.95,2.6-1.36c0.44-0.22,0.89-0.43,1.34-0.62c-0.82-1.45-1.75-2.75-2.78-3.9c-1.7-1.91-3.7-3.45-5.87-4.63 c-2.09-1.14-4.33-1.92-6.61-2.35c-4.57-0.87-9.35-0.38-13.59,1.44c-4.19,1.8-7.85,4.91-10.23,9.3c-1.1,2.04-1.94,4.34-2.42,6.9 l-0.35,1.86l-1.85,0.33c-1.82,0.32-3.44,0.76-4.86,1.31c-1.38,0.54-2.61,1.19-3.68,1.97c-0.86,0.62-1.6,1.32-2.23,2.07 c-1.95,2.34-2.86,5.27-2.83,8.23c0.02,3.01,1,6.05,2.81,8.55c0.67,0.93,1.45,1.78,2.34,2.52l0,0.01c0.89,0.74,1.91,1.36,3.06,1.83 c1.13,0.47,2.39,0.8,3.77,1H71.2c2.62-0.63,4.93-1.48,6.89-2.58c1.95-1.09,3.54-2.42,4.74-4.01c0.16-0.21,0.35-0.49,0.56-0.84 C83.55,55.35,83.7,55.11,83.81,54.9L83.81,54.9z" fill="#000000"/></g></svg>';
                }
            } else {
                console.error("Element with id 'weather-conditions' not found.");
            }


            // Tempature Details
            const currentTemp = Math.round(
                ((data.main.temp - 273.15) * 9) / 5 + 32
            );
            const tempBlockElement = document.getElementById("temp-block");
            const tempElement = document.getElementById("temp");

            if (tempBlockElement) {
                if (currentTemp >= 85 && currentTemp < 100) {
                    tempBlockElement.classList.remove("red-text");
                    tempBlockElement.classList.add("yellow-text");
                } else if (currentTemp >= 100) {
                    tempBlockElement.classList.remove("yellow-text");
                    tempBlockElement.classList.add("red-text");
                } else {
                    tempBlockElement.classList.remove("red-text");
                    tempBlockElement.classList.remove("yellow-text");
                }
            } else {
                console.error("Element with id 'temp-block' not found.");
            }

            if (tempElement) {
                tempElement.textContent = currentTemp + "°F";
            } else {
                console.error("Element with id 'temp' not found.");
            }


            // Humidity
            const humidity = data.main.humidity;
            const humidityBlockElement = document.getElementById("humidity-block");
            const humidityElement = document.getElementById("humidity");

            if (humidityBlockElement) {
                if (humidity > 64) {
                    humidityBlockElement.classList.add("red-text");
                } else {
                    humidityBlockElement.classList.remove("red-text");
                }
            } else {
                console.error("Element with id 'humidity-block' not found.");
            }

            if (humidityElement) {
                humidityElement.textContent = humidity + " %";
            } else {
                console.error("Element with id 'humidity' not found.");
            }


            // Wind Speed
            const windSpeed = data.wind.speed;
            const windBlockElement = document.getElementById("wind-block");
            const windElement = document.getElementById("wind");

            if (windBlockElement) {
                if (windSpeed > 9) {
                    windBlockElement.classList.add("red-text");
                } else {
                    windBlockElement.classList.remove("red-text");
                }
            } else {
                console.error("Element with id 'wind-block' not found.");
            }

            if (windElement) {
                windElement.textContent = windSpeed + " m/s";
            } else {
                console.error("Element with id 'wind' not found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching weather details:", error);
            // You might want to update a UI element here to inform the user about the weather fetch error
            // document.getElementById("location").textContent = "Weather Data Unavailable";
        });
};

getWeatherDetails();
setInterval(getWeatherDetails, 1000 * 60 * 5); // Original interval for 5 minutes
//setInterval(getWeatherDetails, 1000); // Retaining your current 1-second interval for testing
