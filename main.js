const strings = require("./strings.json");
// import your json file here that json file contain the array
//--------------------------- start server config ---------------------------------------//
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",

    methods: ["GET", "POST"],
  },
});
//--------------------------- end server config ---------------------------------------//

// Array of texts to display
//please note create html element with id textElement to containe the changing text

const texts = [...strings];
let currentIndex = 0;
// note that time is set using milliseconds so 6 is represent the hours and 60 the minutes and 60 seconds and 1000 is milliseconds
const time = 180 * 1000;
let shuffledTexts = shuffleArray([...texts]); // Make a shuffled copy of the texts

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function changeText() {
  if (currentIndex >= texts.length - 1) {
    console.log("reset");
    currentIndex = 0;
    shuffledTexts = shuffleArray([...texts]); // Reshuffle the texts
  }
  console.log(shuffledTexts[currentIndex], "pre");
  currentIndex++;
  io.emit("textUpdate", shuffledTexts[currentIndex]);
  console.log(shuffledTexts[currentIndex], "current");
}

// Change text every 6 hours
setInterval(changeText, time);
app.get("/", (req, res) => {
  res.send("server running");
});
app.get("/currentIndex", (req, res) => {
  console.log(shuffledTexts[currentIndex]);
  res.status(200).send(shuffledTexts[currentIndex]);
});

server.listen(8000, async () => {
  console.log("we listening");

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("textUpdate", shuffledTexts[currentIndex]);

    // Handle WebSocket disconnection
    io.on("close", () => {
      console.log("Client disconnected");
    });
  });
});
