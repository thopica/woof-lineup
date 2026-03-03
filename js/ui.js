import { LETTERS, VERDICTS, RANKS } from './config.js';
import { formatBreed, rand } from './api.js';

// Switch the visible screen. Only one screen is active at a time.
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Sync the header score-bar with current game state.
export function updateScoreBar(score, round, streak) {
  document.getElementById('score-correct').textContent = score;
  document.getElementById('score-round').textContent   = round;
  document.getElementById('score-streak').textContent  = streak;
}

// Show or hide the score bar.
export function setScoreBarVisible(visible) {
  document.getElementById('score-bar').classList.toggle('visible', visible);
}

// Set the round heading and placard text.
export function setRoundLabel(n, total) {
  document.getElementById('round-label').textContent = `Dog ${n} of ${total}`;
  document.getElementById('placard').textContent     = `Suspect #${n}`;
}

// Show the loading spinner and hide the dog image.
export function showLoading(text = 'Fetching your dog…') {
  document.getElementById('loading-text').textContent = text;
  document.getElementById('dog-loading').style.display = 'flex';
  document.getElementById('dog-img-wrap').classList.remove('visible');
}

// Hide the spinner and reveal the dog image.
export function showDogImage() {
  document.getElementById('dog-loading').style.display = 'none';
  document.getElementById('dog-img-wrap').classList.add('visible');
}

// Render the four choice buttons and attach the click handler.
// `onSelect(breed, buttonElement)` is called when the player clicks.
export function renderChoices(options, onSelect) {
  const el = document.getElementById('choices');
  el.innerHTML = '';
  options.forEach((opt, i) => {
    const btn     = document.createElement('button');
    btn.className = 'choice-btn';
    btn.dataset.val = opt;
    btn.innerHTML   = `<span class="opt-letter">${LETTERS[i]}</span>${formatBreed(opt)}`;
    btn.addEventListener('click', () => onSelect(opt, btn));
    el.appendChild(btn);
  });
}

// Disable all choice buttons and highlight the correct answer.
export function lockChoices(correctBreed) {
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.val === correctBreed) {
      btn.classList.add('reveal-correct');
    }
  });
}

// Display the verdict banner after an answer.
export function showVerdict(type, correctBreed, streak) {
  const v  = VERDICTS[type];
  const el = document.getElementById('verdict');
  el.className = `verdict ${v.cls} show`;

  document.getElementById('verdict-headline').textContent = rand(v.headlines);

  let sub;
  if (type === 'correct') {
    sub = streak > 1
      ? `It's a ${formatBreed(correctBreed)}. 🔥 ${streak} in a row!`
      : `It's a ${formatBreed(correctBreed)}. The precinct applauds.`;
  } else if (type === 'wrong') {
    sub = `It was a ${formatBreed(correctBreed)}. Study those files, detective.`;
  } else {
    sub = `It was a ${formatBreed(correctBreed)}. The dog smirks as it walks out.`;
  }
  document.getElementById('verdict-sub').textContent = sub;
}

// Hide the verdict banner.
export function hideVerdict() {
  document.getElementById('verdict').className = 'verdict';
}

// Enable or disable the Next button.
export function setNextEnabled(enabled) {
  document.getElementById('btn-next').disabled = !enabled;
}

// Populate and display the final results screen.
export function renderFinalScreen(score) {
  const [,, rank, txt] = RANKS.find(([lo, hi]) => score >= lo && score <= hi);
  document.getElementById('final-rank').textContent         = `— ${rank} —`;
  document.getElementById('final-score-big').textContent    = `${score}/10`;
  document.getElementById('final-verdict-text').textContent = txt;
}
