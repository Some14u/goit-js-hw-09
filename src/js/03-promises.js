import { Notify } from 'notiflix/build/notiflix-notify-aio';

const NOTIFY_SETTINGS = {
  timeout: 3000, // Milliseconds
  useIcon: false,
  width: "220px",
}

const form = document.querySelector("form.form");

form.addEventListener("submit", createPromises);

function createPromises(event) {
  event.preventDefault();
  var {
    delay: {value: delay},
    step: {value: delayIncrement},
    amount: {value: amount}
  } = form.elements;

  delay = Number(delay); // Иначе будет конкатенация строк
  delayIncrement = Number(delayIncrement);

  for(let position = 1; position <= amount; position++) {
    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`, NOTIFY_SETTINGS);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`, NOTIFY_SETTINGS);
      });
    delay += delayIncrement;
  }
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(e => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay })
      } else {
        reject({ position, delay })
      }
    }, delay);
  });
}
