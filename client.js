import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const textElement = document.getElementById("textElement");
const socket = io("http://localhost:8000");
socket.on("textUpdate", (text) => {
  console.log(text);
  textElement.innerText = text;
});
