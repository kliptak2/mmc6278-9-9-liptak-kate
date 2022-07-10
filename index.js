// Your code here
const weatherEl = document.getElementById("weather");
const searchBox = document.getElementById("weather-search");
const btn = document.querySelector("button")
const apiKey = "1c882668d9c2c1fecdb66c8653ee2c47"


btn.onclick = async (e) => {
    e.preventDefault();
    let userQuery = searchBox.value;
    searchBox.value = "";
    if (!userQuery) {
        locationNotFound();
        return;
    }
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${apiKey}&q=${userQuery}`
    ).catch(error => locationNotFound())
    console.log(response)
    let jsonData = await response.json()
    console.log(jsonData)
    if ((jsonData.cod && jsonData.cod != 200) || jsonData.data) {   //if jsonData.cod exists and it's not 200 OR if jsonData has a propert of data (i.e. 404 test), render "Location not found"
        locationNotFound();
        return
    }
    renderResult(jsonData)
};

const locationNotFound = () => {   //helper funtion to handle "Location not found" result
    weatherEl.innerHTML = "";
    let h2 = document.createElement("h2")
    h2.textContent = "Location not found"
    weatherEl.replaceChildren(h2)
}

const renderResult = ({name, sys, coord, weather, main, dt,}) => {   //this let us get rid of all the instances of "data." So "data.name" becomes simply "name"
    weatherEl.innerHTML = "";

    let city = document.createElement("h2")
    city.textContent = `${name}, ${sys.country}`

    let mapLink = document.createElement("a")
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}`
    mapLink.target = "__BLANK"
    mapLink.textContent = "Click to view map"

    let img = document.createElement("img")
    img.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`

    let condition = document.createElement("p")
    condition.textContent = weather[0].description
    condition.style.textTransform = "capitalize"

    let currentTemp = document.createElement("p")
    currentTemp.innerHTML = `Current: ${main.temp}&deg; F`

    let feelsLike = document.createElement("p")
    feelsLike.innerHTML = `Feels like: ${main.feels_like}&deg; F`

    let date = new Date(dt * 1000)
    let timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
    let dateEl = document.createElement("p")
    dateEl.textContent = `Last updated: ${timeString}`

    weatherEl.replaceChildren(city, mapLink, img, condition, currentTemp, feelsLike, dateEl)
};