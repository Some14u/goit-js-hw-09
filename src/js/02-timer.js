import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const NOTIFY_TIMEOUT = 6000; // Milliseconds

const flatpickrSettings = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: handlePickedDate,
}

flatpickr("input#datetime-picker", flatpickrSettings);

const startBtn = document.querySelector("button[data-start]");
startBtn.addEventListener("click", startCountdown);
startBtn.disabled = true;

const timerFields = {} // Тут будут элементы с цифрами времени
// Заполняем timerFields парами ключ -> элемент
document.querySelectorAll(".timer .value").forEach(field => {
  const key = Object.keys(field.dataset)[0];
  timerFields[key] = field;
});

var selectedMoment = null;
var startHasBeenPressed = false;
var warningHasBeenShown = false;


// Используется с самого начала, чтобы обновлять состояние кнопки Start
setInterval(testSelectedTime, 1000);


function handlePickedDate({[0]: date}) {
  selectedMoment = date.getTime();
  startHasBeenPressed = false;
  warningHasBeenShown = false;
  testSelectedTime();
}

function testSelectedTime() {
  if (!selectedMoment) return;
  const countdownValue = selectedMoment - Date.now();
  
  startBtn.disabled = startHasBeenPressed || countdownValue < 0;

  if (startHasBeenPressed && countdownValue >= 0) {
    fillPresentationTimer(countdownValue);
  } else {
    startHasBeenPressed = false;
  }

  if (!warningHasBeenShown && !startHasBeenPressed && countdownValue < 0) {
    Notify.failure("Please, choose a date in the future", { timeout: NOTIFY_TIMEOUT });
    warningHasBeenShown = true;
  }
  if (Math.floor(countdownValue / 1000) == 0) {
    Notify.success("The time has come", { timeout: NOTIFY_TIMEOUT });
  }
}


function startCountdown() {
  startHasBeenPressed = true;
  warningHasBeenShown = true; // Отключаем оповещения
  testSelectedTime();
}

function fillPresentationTimer(time) {
  Object.entries(convertMs(time))
    .forEach(([key, value]) => {
    timerFields[key].innerText = value.toString().padStart(2, 0)
    const text = timerFields[key].nextElementSibling;
    text.innerText = respectPlural(text.innerText, value);
  });
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days: days, hours: hours, minutes: minutes, seconds: seconds };
}

function respectPlural(text, value) {
  const isAlreadyPlural = text.charAt(text.length - 1) === "S";
  const shouldBePlural = value != 1;
  if (isAlreadyPlural && !shouldBePlural) return text.slice(0, -1);
  if (!isAlreadyPlural && shouldBePlural) return text + "s";
  return text;
}