import { ROUND_TIME } from './config.js';

let handle    = null;
let startedAt = 0;     // Date.now() snapshot when the timer began
let onExpire  = null;  // callback invoked when the timer reaches zero

// Update the timer bar and digit display.
function setDisplay(remaining) {
  const pct = Math.max(0, remaining / ROUND_TIME) * 100;

  const fill = document.getElementById('timer-fill');
  fill.style.width = `${pct}%`;
  fill.className   = 'timer-fill' + (remaining < 4 && remaining > 0 ? ' warning' : '');

  document.getElementById('timer-digits').textContent =
    Math.ceil(Math.max(0, remaining));
}

// Begin a fresh countdown. Calls `expireCallback` once when time is up.
export function startTimer(expireCallback) {
  stopTimer();
  onExpire  = expireCallback;
  startedAt = Date.now();
  setDisplay(ROUND_TIME);

  // Uses Date.now() delta — immune to floating-point drift from setInterval.
  handle = setInterval(() => {
    const elapsed   = (Date.now() - startedAt) / 1000;
    const remaining = ROUND_TIME - elapsed;

    if (remaining <= 0) {
      setDisplay(0);
      stopTimer();
      onExpire?.();
    } else {
      setDisplay(remaining);
    }
  }, 80);
}

export function stopTimer() {
  if (handle) {
    clearInterval(handle);
    handle = null;
  }
}

export function resetDisplay() {
  setDisplay(ROUND_TIME);
}
