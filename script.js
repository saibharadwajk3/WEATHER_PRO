const fetch = require("node-fetch");
require("dotenv").config();
//create server
const express = require("express");
const app = express();
app.listen(process.env.PORT || 2000, () => console.log("listening at 2000"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
//server side fetch
app.get("/fetchPlaceWeather/:lat/:lng", async(request, response) => {
    let latlng = request.params;
    const lat = latlng.lat;
    const lng = latlng.lng;
    Api_key = process.env.API_KEY;
    //fetch place info
    const place_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${Api_key}
        `;
    const place_res = await fetch(place_url);
    const place_info = await place_res.json();
    //fetch weather
    const weather_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,alerts&appid=${Api_key}
    `;
    const weather_res = await fetch(weather_url);
    const weather_info = await weather_res.json();
    total_data = { place_info, weather_info };
    response.json(total_data);
});