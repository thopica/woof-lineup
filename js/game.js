import { TOTAL_ROUNDS } from './config.js';
import { fetchBreeds, fetchImage, fetchRandomImage, pick, shuffle } from './api.js';
import { startTimer, stopTimer, resetDisplay } from './timer.js';
import {
  showScreen, updateScoreBar, setScoreBarVisible, setRoundLabel,
  showLoading, showDogImage, renderChoices, lockChoices,
  showVerdict, hideVerdict, setNextEnabled, renderFinalScreen,
} from './ui.js';

// ── State ──────────────────────────────────────────────────────────────────

let allBreeds    = [];
let currentRound = 0;
let score        = 0;
let streak       = 0;
let answered     = false;
let correctBreed = '';

// ── Round Loading ──────────────────────────────────────────────────────────

async function loadRound() {
  answered = false;
  stopTimer();
  resetDisplay();

  setNextEnabled(false);
  hideVerdict();
  document.getElementById('choices').innerHTML = '';

  const n = currentRound + 1;
  setRoundLabel(n, TOTAL_ROUNDS);
  updateScoreBar(score, n, streak);
  showLoading('Bringing in suspect...');

  // Try up to 60 random breeds until one returns a valid image.
  let imgUrl = null;
  const pool = pick(allBreeds, 60);

  for (const breed of pool) {
    try {
      imgUrl       = await fetchImage(breed);
      correctBreed = breed;
      break;
    } catch (_) { /* try next breed */ }
  }

  // Last resort: generic random endpoint.
  if (!imgUrl) {
    try {
      imgUrl       = await fetchRandomImage();
      correctBreed = 'mystery dog';
    } catch (_) {
      showLoading('⚠ Could not load a dog. Try next!');
      setNextEnabled(true);
      return;
    }
  }

  // Build answer options: correct breed + 3 unique decoys.
  const decoys  = pick(allBreeds.filter(b => b !== correctBreed), 3);
  const options = shuffle([correctBreed, ...decoys]);

  // Attach image handlers BEFORE setting src so cached images still fire onload.
  const img = document.getElementById('dog-img');

  img.onload = () => {
    showDogImage();
    renderChoices(options, onAnswer);
    startTimer(onTimeUp);
  };

  img.onerror = () => {
    // Fallback: swap to a generic random image and keep going.
    fetchRandomImage()
      .then(url => { img.src = url; })
      .catch(() => {
        showLoading('⚠ Image unavailable.');
        renderChoices(options, onAnswer);
        startTimer(onTimeUp);
      });
  };

  img.src = imgUrl;
}

// ── Answer Handling ────────────────────────────────────────────────────────

function onAnswer(chosen, btn) {
  if (answered) return;
  answered = true;
  stopTimer();
  lockChoices(correctBreed);

  const correct = chosen === correctBreed;
  btn.classList.add(correct ? 'correct' : 'wrong');

  if (correct) { score++; streak++; } else { streak = 0; }

  updateScoreBar(score, currentRound + 1, streak);
  showVerdict(correct ? 'correct' : 'wrong', correctBreed, streak);
  setNextEnabled(true);
}

function onTimeUp() {
  if (answered) return;
  answered = true;
  lockChoices(correctBreed);
  streak = 0;
  updateScoreBar(score, currentRound + 1, streak);
  showVerdict('timeout', correctBreed, streak);
  setNextEnabled(true);
}

// ── Round Navigation ───────────────────────────────────────────────────────

async function nextRound() {
  currentRound++;
  if (currentRound >= TOTAL_ROUNDS) {
    showFinal();
    return;
  }
  await loadRound();
}

function showFinal() {
  stopTimer();
  setScoreBarVisible(false);
  renderFinalScreen(score);
  showScreen('final-screen');
}

// ── Game Lifecycle ─────────────────────────────────────────────────────────

function abortGame() {
  stopTimer();
  setScoreBarVisible(false);
  currentRound = 0;
  score        = 0;
  streak       = 0;
  showScreen('start-screen');
}

async function startGame() {
  const btn = document.getElementById('btn-start');
  btn.disabled    = true;
  btn.textContent = '⏳ Loading breeds…';

  try {
    allBreeds = await fetchBreeds();
  } catch (_) {
    btn.disabled    = false;
    btn.textContent = '⚠ Network error — try again';
    return;
  }

  currentRound = 0;
  score        = 0;
  streak       = 0;
  setScoreBarVisible(true);
  showScreen('game-screen');
  await loadRound();
}

function restartGame() {
  stopTimer();
  currentRound = 0;
  score        = 0;
  streak       = 0;
  setScoreBarVisible(true);
  showScreen('game-screen');
  loadRound();
}

// ── Event Wiring ───────────────────────────────────────────────────────────

document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-next').addEventListener('click', nextRound);
document.getElementById('btn-restart').addEventListener('click', restartGame);
document.getElementById('btn-home').addEventListener('click', abortGame);
