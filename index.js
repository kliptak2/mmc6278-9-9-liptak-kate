// Your code here
var weatherEl = document.getElementById("weather");
var searchBox = document.getElementById("weather-search");
var btn = document.querySelector("button")
var apiKey = "1c882668d9c2c1fecdb66c8653ee2c47"

//Imperfect baseball analogy. Three true outcomes: strikeouts, walks, and home runs. Fetch = the pitch, response = a hit, catch = strike. Await = resolves the promise.
btn.onclick = async function (e) {
    e.preventDefault();
    var userQuery = searchBox.value;
    searchBox.value = "";                   //After get data.value, clear it out
    if (!userQuery) {                        //If user types in anything that's falsy, run the below function 
        renderResult("Location not found");
        return;
    }
    var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${apiKey}&q=${userQuery}`
    ).catch(function (error) {                //If the api returns an error (a.k.a it can't carry out the request), do the following. Important! An error is still a response.
        renderResult("Location not found");
    });
    console.log(response)
    if (response.status !== 200 || response.data?.cod === 404) {
        renderResult("Location not found");
        return
    }
    var jsonData = await response.json()    //This is a promise. Response.json = throwing the pitch. In javascript, a method is like a verb, a doing action.
    console.log(jsonData)
    renderResult(jsonData)
};

function renderResult(data) {
    console.log(data)
    weatherEl.innerHTML = "";
    if (data === "Location not found") {
        var h2 = document.createElement("h2")
        h2.textContent = data
        weatherEl.replaceChildren(h2)
        return
    }
    var city = document.createElement("h2")
    city.textContent = `${data.name}, ${data.sys.country}`

    var mapLink = document.createElement("a")
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${data.coord.lat},${data.coord.lon}`
    mapLink.target = "__BLANK"
    mapLink.textContent = "Click to view map"

    var img = document.createElement("img")
    img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

    var condition = document.createElement("p")
    condition.textContent = data.weather[0].description
    condition.style.textTransform = "capitalize"

    var currentTemp = document.createElement("p")
    currentTemp.innerHTML = `Current: ${data.main.temp}&deg; F`

    var feelsLike = document.createElement("p")
    feelsLike.innerHTML = `Feels like: ${data.main.feels_like}&deg; F`

    var date = new Date(data.dt * 1000)
    var timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
    var dateEl = document.createElement("p")
    dateEl.textContent = `Last updated: ${timeString}`

    weatherEl.replaceChildren(city, mapLink, img, condition, currentTemp, feelsLike, dateEl)
};