// ── AI Web Worker ──────────────────────────────────────────────
// Runs AI computation off the main thread to keep UI smooth

import { findBestMove } from './engine.js';

self.onmessage = function(e) {
  const { state, difficulty } = e.data;
  const bestMove = findBestMove(state, difficulty);
  self.postMessage({ bestMove });
};
