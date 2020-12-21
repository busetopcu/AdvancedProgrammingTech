"use strict";

var MAP

function toHM(t, round) {
    let d = t ? new Date(t * 1000) : new Date()
    if (round && d.getSeconds() > 29)
        d = new Date((t + 30) * 1000) //round
    let h = d.getHours()
    let m = d.getMinutes()
    let twoDigits = t => (t > 9 ? '' : '0') + t
    return twoDigits(h) + ":" + twoDigits(m)
}

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
    date.innerText = dateBuilder()
    showIcon(w.icon), air.innerText = w.main

    lat = data.coord.lat; lon = data.coord.lon;
    console.log(lat, lon)

    MAP.setView([lat, lon], 10)
    L.marker([lat, lon]).addTo(MAP).bindPopup(w.name)

    document.getElementById("searchCity").value = "";
}

function getLocation2(p) { //Approximate
    console.log("ipinfo.io", p.city)
    let [x, y] = p.loc.split(',')
    lat = Number(x); lon = Number(y);
    askWeather()
}
function getLocation1(p) { //Accurate
    console.log("getCurrentPosition")
    lat = p.coords.latitude; lon = p.coords.longitude;
    askWeather()
}
// Weather
var accessKey;
async function askWeather() {
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
    date.innerText = dateBuilder()
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
        console.log(e.latlng.lng)
        lat = e.latlng.lat
        lon = e.latlng.lng
        askWeather()
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

    return dayStr + ", " + dayNum + " " + month + " " + year
}

function showIcon(i) {
    const URL = "https://openweathermap.org/img/w/"
    icon.src = URL + i + ".png"
    document.querySelector('link').href = icon.src

}
function convert(kelvin) {
    return (kelvin - 273.15);
    //return celsius*1.8 + 32
}
// Interaction
function askUser() {
    let k = prompt('Please enter openweather key:')
    if (!k) error('You need an API key')
    return k
}
function error(e) {
    main.style.display = "none"; //hide
    //refs.style.display = "none";
    err.style.display = ''; //show
    throw e
}
function getAPIkey() {
    if (origin.startsWith('http') && localStorage) {
        if (!localStorage.keys) localStorage.keys = '{}'
        let keys = JSON.parse(localStorage.keys)
        if (!keys.openweather) {
            keys.openweather = askUser()
            localStorage.keys = JSON.stringify(keys)
        }
        accessKey = keys.openweather
    } else { //cannot use localStorage
        accessKey = askUser()
    }
}

err.style.display = "none"
getAPIkey(); askLocation(); init()
