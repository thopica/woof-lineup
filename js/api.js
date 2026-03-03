import { API_BASE } from './config.js';

// Flatten the nested breed object from dog.ceo into a plain string array.
// Sub-breeds are represented as "sub main" (e.g. "french bulldog").
export function flattenBreeds(obj) {
  const list = [];
  for (const [breed, subs] of Object.entries(obj)) {
    if (subs.length === 0) {
      list.push(breed);
    } else {
      subs.forEach(sub => list.push(`${sub} ${breed}`));
    }
  }
  return list;
}

// "french bulldog" → "bulldog/french" | "labrador" → "labrador"
export function toApiPath(breed) {
  const p = breed.trim().split(' ');
  return p.length === 2 ? `${p[1]}/${p[0]}` : p[0];
}

// Capitalise every word and replace hyphens with spaces.
export function formatBreed(name) {
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

export function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fetch and return the flat breed list.
export async function fetchBreeds() {
  const r = await fetch(`${API_BASE}/breeds/list/all`);
  const d = await r.json();
  return flattenBreeds(d.message);
}

// Fetch a random image URL for the given breed string.
// Throws if the API does not return status "success".
export async function fetchImage(breed) {
  const r = await fetch(`${API_BASE}/breed/${toApiPath(breed)}/images/random`);
  const d = await r.json();
  if (d.status !== 'success') throw new Error('no image');
  return d.message;
}

// Last-resort fallback: any random dog image.
export async function fetchRandomImage() {
  const r = await fetch(`${API_BASE}/breeds/image/random`);
  const d = await r.json();
  return d.message;
}
