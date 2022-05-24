const startBtn = document.querySelector("button[data-start]");
const stopBtn = document.querySelector("button[data-stop]");

const localStorageKey = "ex-1-background-color";
const INTERVAL = 1000; // milliseconds
var intervalID = null;

startBtn.addEventListener("click", startDisco);
stopBtn.addEventListener("click", stopDisco);

changeBodyColor(localStorage.getItem(localStorageKey) || "#fafafa");
document.body.style.transition = `background-color ${Math.floor(INTERVAL / 2)}ms ease-in-out`;

function startDisco() {
  if (intervalID) return;
  intervalID = setInterval(changeBodyColor, INTERVAL);
  startBtn.classList.toggle("disabled");
  stopBtn.classList.toggle("disabled");
}


function stopDisco() {
  if (!intervalID) return;
  clearInterval(intervalID);
  intervalID = null;
  startBtn.classList.toggle("disabled");
  stopBtn.classList.toggle("disabled");
}

function changeBodyColor(color) {
  document.body.style.backgroundColor = color || getRandomHexColor();
  localStorage.setItem(localStorageKey, document.body.style.backgroundColor);
}

function getRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0);
}
