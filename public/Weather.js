document.getElementById("title").scrollIntoView();

const wDay = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const wMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apl",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const iconValue = {
    CLEARSKY: "clear sky",
    FEWCLOUDS: "few clouds",
    SCATTEREDCLOUDS: "scattered clouds",
    BROKENCLOUDS: "broken clouds",
    SHOWERRAIN: "shower rain",
    RAIN: "rain",
    THUNDERSTORM: "thunderstorm",
    SNOW: "snow",
    MIST: "mist",
};

// fetching from local rout
// place info

async function fetchCurrentPlace(latitude, longitude) {
    console.log(latitude, longitude);
    const url1 = `/fetchPlaceWeather/${latitude}/${longitude}`;
    //fetch
    let response = await fetch(url1);
    let obj = await response.json();
    let data = obj.place_info;

    //call openweather function to get weather info
    fetchOpenWeather(obj);
    //call draw function to draw graph

    draw(obj);
    document.querySelector("#wpForecast").style.borderLeft = "1px solid white";

    //pulling date and time
    let dt = new Date(data.dt * 1000);
    let forecastDate = `${wDay[dt.getDay()]} ${
    wMonth[dt.getMonth()]
  } ${dt.getDate()}`;

    //pulling current temperature

    let temperature = data.main.temp - 273.15;

    //populating dom

    document.getElementById(
        "location"
    ).innerHTML = `(<i class="fas fa-location-arrow"></i>): ${data.name},${data.sys.country}`;

    // document.getElementById(
    //     "summary"
    // ).innerHTML = `(<i class="fas fa-cloud"></i>): ${data.weather[0].main}`;
    document.getElementById(
        "dayTime"
    ).innerHTML = `(<i class="far fa-clock"></i>): ${forecastDate}
            `;
    document.getElementById("currentTemp").innerHTML = ` ${temperature.toFixed(
    2
  )}${"°C"}`;

    document.getElementById(
        "Iconsummary"
    ).innerHTML = `${data.weather[0].main}<br>${data.weather[0].description}`;

    let bgUrl = bgChange(`${data.weather[0].description}`);

    let showcase = document.querySelector(".showcase");
    showcase.style.background = `url(${bgUrl})`;
    showcase.style.backgroundRepeat = "no-repeat";
    showcase.style.backgroundSize = "cover";
    showcase.style.backgroundPosition = "center center";
}
//weather info
function fetchOpenWeather(info) {
    let data = info.weather_info;
    //initilising rrquired data
    let icon = data.current.weather[0].icon;
    let humidity = data.current.humidity;
    let windSpeed = data.current.wind_speed;
    let ts1 = new Date(data.current.sunrise * 1000);
    let ts2 = new Date(data.current.sunset * 1000);
    // console.log(ts1, ts2);
    let sunRise_h = ts1.getHours();
    let sunRise_m = ts1.getMinutes();
    let SunSet_h = ts2.getHours();
    let SunSet_m = ts2.getMinutes();

    //populating dom
    document.getElementById(
        "Sun_Rise"
    ).innerHTML = `Sunrise(<i class="fas fa-sun"></i>): ${sunRise_h}.${sunRise_m} A.M`;
    document.getElementById(
        "Sun_set"
    ).innerHTML = `Sunset(<i class="fas fa-cloud-sun"></i>): ${
    SunSet_h - 12
  }.${SunSet_m} p.M`;

    document.getElementById(
        "Humidity"
    ).innerHTML = `Humidity(<i class="fas fa-tint"></i>): ${Math.round(
    humidity
  )}%`;
    document.getElementById(
        "wind"
    ).innerHTML = `WindSpeed(<i class="fas fa-wind"></i>): ${windSpeed}mp/h`;
    //  console.log(icon);
    document.getElementById("WeatherIcon").src = getIcon(icon);

    //render the forecasts tabs daily and hourly
    document.getElementById("dailyForecast").innerHTML = renderDailyForecast(
        data.daily
    );
    document.getElementById("weeklyForecast").innerHTML = renderHourlyForecast(
        data.hourly
    );

    //calling function to get icon
    getIcon(icon);

    document.querySelector(".loader").style.display = "none";
    document.querySelector(".mar").style.borderLeft = "1px solid white";

    showAlert(
        "Weather forecast based on address,to which your wi-fi is registered to (Not GPS).For accurate results open site in mobile",
        "success"
    );
}

//bg chang
function bgChange(discription) {
    switch (discription) {
        case iconValue.CLEARSKY:
            return "images/clearsky.webp";

        case iconValue.FEWCLOUDS:
            return "images/fewclouds.webp";

        case iconValue.SCATTEREDCLOUDS:
            return "images/scatteredclouds.jpg";

        case iconValue.BROKENCLOUDS:
            return "images/scatteredclouds.jpg";
        case iconValue.SHOWERRAIN:
            return "images/showerrain.jpg";

        case iconValue.RAIN:
            return "images/showerrain.jpg";

        case iconValue.THUNDERSTORM:
            return "images/thunderstorm.webp";

        case iconValue.SNOW:
            return "images/snow.jpg";

        case iconValue.MIST:
            return "images/mist.webp";

        default:
            return "images/clearsky.webp";
    }
}
//icon
function getIcon(icon) {
    //for morning icon
    if (icon.indexOf("d") > -1) {
        return `http://openweathermap.org/img/wn/${icon}@4x.png`;
    }
    //for night icon
    if (icon.indexOf("n") > -1) {
        return `http://openweathermap.org/img/wn/${icon}@4x.png`;
    } else {
        return "images/sun.jpg";
    }
}
//render the hourly forecast
function renderHourlyForecast(fcData) {
    // console.log(fcData);
    let resultsHTML =
        "<tr><th>Time</th><th>Humidity</th><th>Temp</th><th>wind_speed</th></tr>";
    rowcount = fcData.length;
    if (rowcount > 8) {
        rowcount = 8;
    }

    for (i = 0; i < rowcount; i++) {
        let ts = new Date(fcData[i].dt * 1000);
        // console.log(ts);
        let humidity = "";

        let timeValue;

        //unix time needs to be formatted for display
        let hours = ts.getHours();
        let min = ts.getMinutes();
        // console.log(hours, min);
        if (hours > 0 && hours <= 12) {
            timeValue = "" + hours;
        } else if (hours > 12) {
            timeValue = "" + (hours - 12);
        } else if (hours == 0) {
            timeValue = "12";
        }
        timeValue += hours >= 12 ? " PM" : " AM"; // get AM/PM

        humidity = `${fcData[i].humidity}%`;

        let tempHigh = `${Math.round(fcData[i].temp - 273.15)}&deg C`;
        let windSpeed = `${fcData[i].wind_speed}mp/h`;

        resultsHTML += renderRow(timeValue, humidity, tempHigh, windSpeed);
    }

    return resultsHTML;
}
//render the daily forecast
function renderDailyForecast(fcData) {
    // console.log(fcData);
    let resultsHTML =
        "<tr><th>Day</th><th>Conditions</th><th>Max_Temp</th><th>Min_temp</th></tr>";
    rowcount = fcData.length;
    if (rowcount > 8) {
        rowcount = 8;
    }

    for (i = 0; i < rowcount; i++) {
        let ts = new Date(fcData[i].dt * 1000);
        let dayTime = `${wDay[ts.getDay()]} ${
      wMonth[ts.getMonth()]
    } ${ts.getDate()}`;
        // let dayTime = wDay[ts.getDay()];
        let description = fcData[i].weather[0].description;
        let tempHigh = `${Math.round(fcData[i].temp.max - 273.15)}&deg C`;
        let tempLow = `${Math.round(fcData[i].temp.min - 273.15)}&deg C`;

        resultsHTML += renderRow(dayTime, description, tempHigh, tempLow);
    }

    return resultsHTML;
}
//template function to render grid colums
function renderRow(dayTime, des, tempHigh, colVal4) {
    return `<tr><td>${dayTime}</td><td>${des}</td><td>${tempHigh}</td><td>${colVal4}</td></tr>`;
}

function draw(object) {
    array48 = object.weather_info.hourly;

    let xs = [];
    let ys = [];

    array48.forEach((item) => {
        let timeValue;
        let hours = new Date(item.dt * 1000).getHours();
        if (hours > 0 && hours <= 12) {
            timeValue = "" + hours;
        } else if (hours > 12) {
            timeValue = "" + (hours - 12);
        } else if (hours == 0) {
            timeValue = "12";
        }
        timeValue += hours >= 12 ? " PM" : " AM";
        let temperature = `${(item.temp - 273.15).toFixed(2)}`;

        xs.push(timeValue);
        ys.push(parseFloat(temperature));
    });

    let ctx = document.getElementById("graph48").getContext("2d");

    let myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: xs,
            datasets: [{
                label: "Next 48 hours Temp in °C",
                data: ys,
                fill: false,

                backgroundColor: "rgba(255,255,255,1)",
                borderColor: "rgba(255,0,0,1)",
                borderWidth: 1,
            }, ],
        },
        options: {
            scales: {
                yAxes: [{
                    gridLines: {
                        display: true,
                        color: "rgba(255, 255, 255,.6)",
                    },
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return value + "°";
                        },
                    },
                }, ],

                xAxes: [{
                    gridLines: {
                        display: true,
                        color: "#FFFFFF",
                    },
                }, ],
            },
        },
    });
}

function initGeoLocation() {
    if (navigator.geolocation) {
        //returns a callback function
        navigator.geolocation.getCurrentPosition(success, fail);
    } else {
        showAlert("Look like your browser do not support GeoLocation", "danger");
    }
}

//if access location is allowed
function success(position) {
    document.querySelector(".center").classList.add("loader");
    // fetchOpenWeather(position.coords.latitude, position.coords.longitude);
    fetchCurrentPlace(position.coords.latitude, position.coords.longitude);
}
//if access location is denied
function fail() {
    //add hard coded lat and long
    showAlert(
        "To fetch weather data site need access to your location..!",
        "danger"
    );
    // fetchCurrentPlace(13.3, 78.68);
}

// dom events

function showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className} mt-3`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const titleRow = document.querySelector(".row1");
    container.insertBefore(div, titleRow);
    container.scrollIntoView();

    //vanish in 3 sec

    setTimeout(() => document.querySelector(".alert").remove(), 9000);
}

document.querySelector(".b1").addEventListener("click", (e) => {
    document.getElementById("hourly").classList.add("active");
    document.getElementById("weekly").classList.remove("active");
    document.getElementById("graph").classList.remove("active");
});

document.querySelector(".b2").addEventListener("click", (e) => {
    document.getElementById("weekly").classList.add("active");
    document.getElementById("hourly").classList.remove("active");
    document.getElementById("graph").classList.remove("active");
});

document.querySelector(".b3").addEventListener("click", (e) => {
    document.getElementById("graph").classList.add("active");
    document.getElementById("hourly").classList.remove("active");
    document.getElementById("weekly").classList.remove("active");
});

//gsap animation

function animate() {
    const timeline = gsap.timeline({
        defaults: { duration: 1.5 },
        onComplete: initGeoLocation,
    });
    timeline
        .from(".row1", { y: "-100%", ease: "bounce" })
        .from(".row2", {
            x: "-100vw",
            ease: "slow(0.5, 0.8)",
        })

    .from(".row3", {
            x: "100vw",
            ease: "slow(0.5, 0.8)",
        })
        .from(".row4", {
            y: "100vh",
            ease: "bounce",
        });
}

animate();