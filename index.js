const http = require("http");
const fs = require("fs");
var requests = require("requests");

const index = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%temp%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=4e6ff70ceb6077a2140398f09ee9f496"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
        // console.log(arrdata[0].main.temp);
        const realTimeData = arrdata
          .map((val) => replaceVal(index, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
  }
});

server.listen(8080, "127.0.0.1");
