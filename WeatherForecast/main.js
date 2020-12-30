"use strict";

var MAP
async function toJSON(url) {
    let r = await fetch(url)
    if (!r.ok) error(r.statusText)
    return r.json()
}

// Location
var lat, lon;  //global values
async function askLocation() {
    let name = 'geolocation'
    let result = await navigator.permissions.query({ name })
    if (result.state == 'denied') {
        let url = "https://ipinfo.io/json"
        toJSON(url).then(getLocation2, error)
    } else {
        navigator.geolocation
            .getCurrentPosition(getLocation1, error);
    }
}

async function searchLocation(value) {

    let c = value;
    console.log(c);
    const U = "https://api.openweathermap.org/data/2.5/weather?"
    let url = U + "q=" + c + "&APPID=" + accessKey;

    let data = await toJSON(url)
    let w = data.weather[0];

    let celsius = convert(data.main.temp).toFixed(0)
    temp.innerText = celsius + '°c'
    city.innerText = data.name + ', ' + data.sys.country
    dateBuilder();
    showIcon(w.icon);
    air.innerText = w.main

    lat = data.coord.lat; lon = data.coord.lon;


    MAP.setView([lat, lon], 10)
    L.marker([lat, lon]).addTo(MAP).bindPopup(w.name)

    document.getElementById("searchCity").value = "";
    err.style.display = "none"
}

async function searchForecast(value) {
    let c = value;

    const U = "https://api.openweathermap.org/data/2.5/forecast?"
    let url = U + "q=" + c + "&APPID=" + accessKey;
    let data = await toJSON(url)

    lat = data.city.coord.lat;
    lon = data.city.coord.lon;
    console.log(data.city.coord.lat, data.city.coord.lon)

    searchLocation(c);

    for (let i = 0; i < 39; i++) {
        if (i == 8) {
            let s = data.list[i];
            let w = data.list[i].weather[0];
            air1.innerText = w.main
            temp1.innerHTML = convert(s.main.temp).toFixed(0) + '°'
            icon1.innerHTML = showIcon2(w.icon)
            time1.innerText = readTime(s.dt_txt)
            console.log(w.main, convert(s.main.temp).toFixed(0));
        }
        else if (i == 16) {
            let s = data.list[i];
            let w = data.list[i].weather[0];
            air2.innerText = w.main
            temp2.innerText = convert(s.main.temp).toFixed(0) + '°'
            icon2.innerHTML = showIcon2(w.icon)
            time2.innerText = readTime(s.dt_txt)
            console.log(w.main, convert(s.main.temp).toFixed(0));
        }
        else if (i == 24) {
            let s = data.list[i];
            let w = data.list[i].weather[0];
            air3.innerText = w.main
            temp3.innerText = convert(s.main.temp).toFixed(0) + '°'
            icon3.innerHTML = showIcon2(w.icon)
            time3.innerText = readTime(s.dt_txt)
            console.log(w.main, convert(s.main.temp).toFixed(0));
        }
        else if (i == 32) {
            let s = data.list[i];
            let w = data.list[i].weather[0];
            air4.innerText = w.main
            temp4.innerText = convert(s.main.temp).toFixed(0) + '°'
            icon4.innerHTML = showIcon2(w.icon)
            time4.innerText = readTime(s.dt_txt)
            console.log(w.main, convert(s.main.temp).toFixed(0));
        }
        i++;
    }
}

async function askForecast() {
    const U = "https://api.openweathermap.org/data/2.5/forecast?"
    let url = U + "lat=" + lat + "&lon=" + lon + "&APPID=" + accessKey;

    let data = await toJSON(url)
    lat = data.city.coord.lat; lon = data.city.coord.lon;


    for (let i = 0; i < 39; i++) {
        if (i == 8) {
            let s = data.list[i];
            let w = data.list[i].weather[0];

            air1.innerText = w.main
            temp1.innerHTML = convert(s.main.temp).toFixed(0) + '°'
            icon1.innerHTML = showIcon2(w.icon)
            time1.innerText = readTime(s.dt_txt)
            console.log(w.main, convert(s.main.temp).toFixed(0));
        }
        else if (i == 16) {
            let s = data.list[i];
            let w = data.list[i].weather[0];

            air2.innerText = w.main
            temp2.innerText = convert(s.main.temp).toFixed(0) + '°'
            icon2.innerHTML = showIcon2(w.icon)
            time2.innerText = readTime(s.dt_txt)
            console.log(w.main, convert(s.main.temp).toFixed(0));
        }
        else if (i == 24) {
            let s = data.list[i];
            let w = data.list[i].weather[0];

            air3.innerText = w.main
            temp3.innerText = convert(s.main.temp).toFixed(0) + '°'
            icon3.innerHTML = showIcon2(w.icon)
            time3.innerText = readTime(s.dt_txt)
            console.log(w.main, convert(s.main.temp).toFixed(0));
        }
        else if (i == 32) {
            let s = data.list[i];
            let w = data.list[i].weather[0];

            air4.innerText = w.main
            temp4.innerText = convert(s.main.temp).toFixed(0) + '°'
            icon4.innerHTML = showIcon2(w.icon)
            time4.innerText = readTime(s.dt_txt)
            console.log(w.main, convert(s.main.temp).toFixed(0));
        }
        i++;
    }
}

function getLocation2(p) { //Approximate
    console.log("ipinfo.io", p.city)
    let [x, y] = p.loc.split(',')
    lat = Number(x); lon = Number(y);
    askWeather();
    askForecast();
}
function getLocation1(p) { //Accurate
    console.log("getCurrentPosition")
    lat = p.coords.latitude; lon = p.coords.longitude;
    askWeather();
    askForecast();
}
// Weather
var accessKey;
async function askWeather() {
    lat = lat;
    lon = lon;
    console.log(lat, lon);
    const U = "https://api.openweathermap.org/data/2.5/weather?"
    let url = U + "lat=" + lat + "&lon=" + lon + "&APPID=" + accessKey;

    let data = await toJSON(url)

    let w = data.weather[0];

    MAP.setView([lat, lon], 10)
    L.marker([lat, lon]).addTo(MAP).bindPopup(w.name)

    let celsius = convert(data.main.temp).toFixed(0)
    temp.innerText = celsius + '°c'
    city.innerText = data.name + ', ' + data.sys.country
    dateBuilder();
    showIcon(w.icon), air.innerText = w.main

    let h = w.main + "  " + celsius + "°", { sys } = data
    let y = data.name + ', ' + sys.country
    console.log(h, y); console.log(sys)

    lat = data.coord.lat; lon = data.coord.lon

    document.getElementById("searchCity").value = data.name;
}
function init() {
    let p = { lat: 49, lng: 51 }
    console.log('init at', p)
    //L is global object from leaflet
    MAP = L.map('map').setView(p, 10)  //setZoom(10)
    let u = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    let attribution = '&copy; OpenStreetMap contributors'
    L.tileLayer(u, { attribution }).addTo(MAP)
    //let report = () => out.innerText = MAP.getZoom()
    //MAP.on('zoom', report); report()
    MAP.on('click', e => {
        console.log(e.latlng)
        lat = e.latlng.lat;
        lon = e.latlng.lng;
        askWeather();
        askForecast();

    })
}

function dateBuilder() {
    let d = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let dayStr = days[d.getDay()];  //0-6
    let dayNum = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    date.innerText = dayStr + ", " + dayNum + " " + month + " " + year;

    date1.innerText = (d.getDay() + 1 < 7) ? days[d.getDay() + 1] : days[(d.getDay() + 1) % 7];
    date2.innerText = (d.getDay() + 2 < 7) ? days[d.getDay() + 2] : days[(d.getDay() + 2) % 7];
    date3.innerText = (d.getDay() + 3 < 7) ? days[d.getDay() + 3] : days[(d.getDay() + 3) % 7];
    date4.innerText = (d.getDay() + 4 < 7) ? days[d.getDay() + 4] : days[(d.getDay() + 4) % 7];
}

function readTime(i) {
    console.log(i)
    let [x, y] = i.split(' ')
    let [a, b, c] = y.split(':')
    let g = b + "" + c + "" + a
    //let n = g.replace('-', '/').replace('-', '/')
    return a + ":" + b
}

function showIcon(i) {
    const URL = "https://openweathermap.org/img/w/"
    icon.src = URL + i + ".png"
    //document.querySelector('link').href = icon.src
}

function showIcon2(i) {
    const URL = "https://openweathermap.org/img/w/"
    return "<img src=" + URL + i + ".png>"
}

function convert(kelvin) {
    return (kelvin - 273.15);
    //return celsius*1.8 + 32
}

function error(e) {
    //main.style.display = "none"; //hide
    //refs.style.display = "none";
    err.style.display = ''; //show
    throw e
}
function getAPIkey() {
    if (origin.startsWith('http') && localStorage) {
        if (!localStorage.keys) localStorage.keys = '{}'
        let keys = JSON.parse(localStorage.keys)
        if (!keys.openweather) {
            keys.openweather = "8bfa37e735e70105d70e1db7208ae848";
            localStorage.keys = JSON.stringify(keys)
        }
        accessKey = keys.openweather
    } else { //cannot use localStorage
        accessKey = "8bfa37e735e70105d70e1db7208ae848";
    }
}

err.style.display = "none"
getAPIkey(); askLocation(); init(); 