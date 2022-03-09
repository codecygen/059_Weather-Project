const express = require('express');
const app = express();

const https = require('https');

app.use(express.urlencoded({extended: true}));

const dotenv = require('dotenv');
dotenv.config();

app.get("/", (req, res) => {
  // use res.sendFile, instead of res.render because, this file does not have ejs installed as dependency. So this is a static website.
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/", (req, res) => {
  const query = req.body.cityName;

  const url = `${process.env.URL1}${query}${process.env.URL2}${process.env.KEY}${process.env.URL3}`;

  https.get(url, (response) => {

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const weatherTemperature = weatherData.main.temp;
      const weatherDesccription = weatherData.weather[0].description;
      const weatherIconID = weatherData.weather[0].icon;
      const weatherIconURL = "http://openweathermap.org/img/wn/" + weatherIconID +"@2x.png";

      res.write(`<h1>The temperature in ${query} is ${weatherTemperature} &#8451;.</h1>`);
      res.write("<h1>The weather condition: " + weatherDesccription + ".</h1>");
      res.write(`<img src=${weatherIconURL} alt='weatherIcon'>`);
      res.send();
    });

  });
});

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});