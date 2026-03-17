// ── Fatima Chess Board — Main Application ──────────────────────
import { GameController } from './engine/game.js';
import { BoardRenderer } from './renderer/boardRenderer.js';
import { preloadPieces, getPieceImage } from './renderer/pieces.js';
import { ThemeManager } from './themes/themeManager.js';
import { SoundManager } from './audio/soundManager.js';
import { findBestMove } from './ai/engine.js';
import { WHITE, BLACK, QUEEN, ROOK, BISHOP, KNIGHT, PIECE_VALUES } from './engine/constants.js';

// ── App State ──────────────────────────────────────────────────
const app = {
  game: new GameController(),
  renderer: null,
  themes: new ThemeManager(),
  sounds: new SoundManager(),
  aiWorker: null,
  
  // Game settings
  mode: 'pvp',           // 'pvp' or 'bot'
  difficulty: 'advanced',
  playerColor: WHITE,
  timeControl: { minutes: 10, increment: 5 },
  
  // Clock state
  clocks: { w: 600, b: 600 },
  clockInterval: null,
  clockRunning: false,
  
  // UI state
  flipped: false,
  botThinking: false,
  
  // New game modal state
  modalOptions: {
    mode: 'pvp',
    difficulty: 'advanced',
    color: 'w',
    time: '10|5'
  }
};

// ── Initialization ─────────────────────────────────────────────
async function init() {
  await preloadPieces();
  
  const canvas = document.getElementById('chess-board');
  app.renderer = new BoardRenderer(canvas, app.themes);
  
  // Set up event listeners
  setupBoardEvents(canvas);
  setupUIEvents();
  setupModalEvents();
  setupThemeSelector();
  
  // Handle resize
  window.addEventListener('resize', () => {
    app.renderer.resize();
    renderBoard();
  });
  
  // Initial render
  renderBoard();
  
  // Hide loading screen
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
  }, 600);

  // Create AI worker if supported to keep UI responsive for higher depths
  if (window.Worker) {
    try {
      app.aiWorker = new Worker('src/ai/botWorker.js', { type: 'module' });
      app.aiWorker.onmessage = (e) => {
        const bestMove = e.data && e.data.bestMove;
        app.botThinking = false;
        updateStatus();

        if (!bestMove || app.game.isGameOver()) return;

        const state = app.game.getState();
        const piece = state.board[bestMove.from[0]][bestMove.from[1]];
        app.renderer.animateMove(
          bestMove.from[0], bestMove.from[1],
          bestMove.to[0], bestMove.to[1],
          piece.color, piece.type,
          () => {
            app.game.selectedSquare = bestMove.from;
            app.game.legalMovesForSelected = app.game.getLegalMoves().filter(
              m => m.from[0] === bestMove.from[0] && m.from[1] === bestMove.from[1]
            );
            app.game.executeMove(bestMove);
            onMoveMade();
          }
        );

        const animLoop = () => {
          renderBoard();
          if (app.renderer.animatingPiece) requestAnimationFrame(animLoop);
        };
        requestAnimationFrame(animLoop);
      };
    } catch (err) {
      console.warn('AI worker init failed, falling back to main-thread AI', err);
      app.aiWorker = null;
    }
  }
}

// ── Board Rendering ────────────────────────────────────────────
function renderBoard() {
  app.botThinking = true;
  updateStatus();

  // Add small delay for UX
  setTimeout(() => {
    const state = app.game.getState();

    // If a worker is available, use it to compute the move off the main thread
    if (app.aiWorker) {
      try {
        app.aiWorker.postMessage({ state, difficulty: app.difficulty });
      } catch (err) {
        console.warn('AI worker postMessage failed, falling back to main-thread AI', err);
        app.aiWorker = null;
      }
      return;
    }

    // Fallback: compute on main thread
    const bestMove = findBestMove(state, app.difficulty);

    if (bestMove && !app.game.isGameOver()) {
      // Animate the move
      const piece = state.board[bestMove.from[0]][bestMove.from[1]];
      app.renderer.animateMove(
        bestMove.from[0], bestMove.from[1],
        bestMove.to[0], bestMove.to[1],
        piece.color, piece.type,
        () => {
          app.game.selectedSquare = bestMove.from;
          app.game.legalMovesForSelected = app.game.getLegalMoves().filter(
            m => m.from[0] === bestMove.from[0] && m.from[1] === bestMove.from[1]
          );
          app.game.executeMove(bestMove);
          app.botThinking = false;
          onMoveMade();
        }
      );

      // Keep re-rendering during animation
      const animLoop = () => {
        renderBoard();
        if (app.renderer.animatingPiece) requestAnimationFrame(animLoop);
      };
      requestAnimationFrame(animLoop);
    }
  }, 300 + Math.random() * 400);
    
    const [row, col] = sq;
    const piece = app.game.getState().board[row][col];
    
    // Can only interact on your turn (in bot mode)
    if (app.mode === 'bot' && app.game.getTurn() !== app.playerColor) return;
    
    if (piece && piece.color === app.game.getTurn()) {
      isDragging = true;
      dragStartSquare = [row, col];
      app.renderer.startDrag(row, col, piece.color, piece.type, pos.x, pos.y);
      
      // Also select the square
      app.game.selectSquare(row, col);
      renderBoard();
    } else {
      // Try click-to-move (if piece already selected)
      const result = app.game.selectSquare(row, col);
      handleMoveResult(result);
    }
  }
  
  function handleMove(e) {
    e.preventDefault();
    if (!isDragging) return;
    const pos = getPos(e);
    app.renderer.updateDrag(pos.x, pos.y);
    renderBoard();
  }
  
  function handleEnd(e) {
    e.preventDefault();
    if (!isDragging) {
      return;
    }
    
    isDragging = false;
    app.renderer.endDrag();
    
    const pos = e.changedTouches ? 
      { x: e.changedTouches[0].clientX - canvas.getBoundingClientRect().left,
        y: e.changedTouches[0].clientY - canvas.getBoundingClientRect().top } :
      getPos(e);
    
    const sq = app.renderer.pixelToSquare(pos.x, pos.y);
    if (!sq || !dragStartSquare) {
      renderBoard();
      return;
    }
    
    const [row, col] = sq;
    const [fromRow, fromCol] = dragStartSquare;
    
    // Don't process if dropped on same square
    if (row === fromRow && col === fromCol) {
      renderBoard();
      return;
    }
    
    const result = app.game.tryMove(fromRow, fromCol, row, col);
    handleMoveResult(result);
    
    dragStartSquare = null;
  }
  
  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('touchstart', handleStart, { passive: false });
  canvas.addEventListener('touchmove', handleMove, { passive: false });
  canvas.addEventListener('touchend', handleEnd, { passive: false });
}

// ── Handle Move Results ────────────────────────────────────────
function handleMoveResult(result) {
  if (!result) return;
  
  switch (result.type) {
    case 'moved':
      onMoveMade();
      break;
    case 'promotion':
      showPromotionPicker(result.from, result.to);
      break;
    case 'selected':
    case 'deselected':
    case 'none':
      renderBoard();
      break;
  }
}

function onMoveMade() {
  const lastMove = app.game.getLastMove();
  const san = app.game.sanHistory[app.game.sanHistory.length - 1];
  
  // Play sound
  if (app.game.gameResult) {
    app.sounds.gameOver();
  } else if (app.game.isInCheck()) {
    app.sounds.check();
  } else if (lastMove.castle) {
    app.sounds.castle();
  } else if (lastMove.capture) {
    app.sounds.capture();
    app.renderer.spawnCaptureParticles(lastMove.to[0], lastMove.to[1]);
  } else {
    app.sounds.move();
  }
  
  // Clock: add increment and switch
  if (app.clockRunning) {
    const prevTurn = app.game.getTurn() === WHITE ? BLACK : WHITE;
    app.clocks[prevTurn] += app.timeControl.increment;
  }
  
  // Start clock on first move
  if (app.game.moveHistory.length === 1 && app.timeControl.minutes > 0) {
    startClock();
  }
  
  // Update UI
  updateMoveList();
  updatePlayerBars();
  updateStatus();
  updateClockDisplay();
  renderBoard();
  
  // Check game over
  if (app.game.gameResult) {
    handleGameOver();
    return;
  }
  
  // Bot move
  if (app.mode === 'bot' && app.game.getTurn() !== app.playerColor) {
    scheduleBotMove();
  }
}

// ── Promotion Picker ───────────────────────────────────────────
function showPromotionPicker(from, to) {
  const picker = document.getElementById('promotion-picker');
  const color = app.game.getTurn();
  const pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
  
  picker.innerHTML = '';
  for (const piece of pieces) {
    const btn = document.createElement('button');
    btn.className = 'promotion-option';
    const img = getPieceImage(color, piece);
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = piece;
      btn.appendChild(imgEl);
    } else {
      btn.textContent = piece.toUpperCase();
    }
    btn.addEventListener('click', () => {
      app.game.executePromotion(from, to, piece);
      app.sounds.promote();
      picker.classList.add('hidden');
      onMoveMade();
    });
    picker.appendChild(btn);
  }
  
  // Position the picker near the promotion square
  const [px, py] = app.renderer.squareToPixel(to[0], to[1]);
  const sq = app.renderer.squareSize;
  picker.style.left = px + 'px';
  picker.style.top = (color === WHITE ? py : py - sq * 3) + 'px';
  picker.classList.remove('hidden');
}

// ── Bot AI ─────────────────────────────────────────────────────
function scheduleBotMove() {
  app.botThinking = true;
  updateStatus();
  
  // Add small delay for UX
  setTimeout(() => {
    const state = app.game.getState();
    const bestMove = findBestMove(state, app.difficulty);
    
    if (bestMove && !app.game.isGameOver()) {
      // Animate the move
      const piece = state.board[bestMove.from[0]][bestMove.from[1]];
      app.renderer.animateMove(
        bestMove.from[0], bestMove.from[1],
        bestMove.to[0], bestMove.to[1],
        piece.color, piece.type,
        () => {
          app.game.selectedSquare = bestMove.from;
          app.game.legalMovesForSelected = app.game.getLegalMoves().filter(
            m => m.from[0] === bestMove.from[0] && m.from[1] === bestMove.from[1]
          );
          app.game.executeMove(bestMove);
          app.botThinking = false;
          onMoveMade();
        }
      );
      
      // Keep re-rendering during animation
      const animLoop = () => {
        renderBoard();
        if (app.renderer.animatingPiece) requestAnimationFrame(animLoop);
      };
      requestAnimationFrame(animLoop);
    }
  }, 300 + Math.random() * 400);
}

// ── Chess Clock ────────────────────────────────────────────────
function startClock() {
  if (app.clockInterval || app.timeControl.minutes === 0) return;
  app.clockRunning = true;
  
  app.clockInterval = setInterval(() => {
    if (app.game.isGameOver() || !app.clockRunning) return;
    
    const turn = app.game.getTurn();
    app.clocks[turn] -= 0.1;
    
    if (app.clocks[turn] <= 0) {
      app.clocks[turn] = 0;
      // Time ran out — current player loses
      app.game.gameResult = 'timeout';
      app.game.winner = turn === WHITE ? BLACK : WHITE;
      handleGameOver();
      stopClock();
    }
    
    updateClockDisplay();
  }, 100);
}

function stopClock() {
  if (app.clockInterval) {
    clearInterval(app.clockInterval);
    app.clockInterval = null;
  }
  app.clockRunning = false;
}

function resetClocks() {
  stopClock();
  const seconds = app.timeControl.minutes * 60;
  app.clocks = { w: seconds, b: seconds };
  updateClockDisplay();
}

function formatTime(seconds) {
  if (seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateClockDisplay() {
  const turn = app.game.getTurn();
  const topColor = app.flipped ? WHITE : BLACK;
  const bottomColor = app.flipped ? BLACK : WHITE;
  
  const clockTop = document.getElementById('clock-top');
  const clockBottom = document.getElementById('clock-bottom');
  
  clockTop.textContent = formatTime(app.clocks[topColor]);
  clockBottom.textContent = formatTime(app.clocks[bottomColor]);
  
  // Active state
  clockTop.className = 'clock' + (turn === topColor && !app.game.isGameOver() ? ' active' : '');
  clockBottom.className = 'clock' + (turn === bottomColor && !app.game.isGameOver() ? ' active' : '');
  
  // Low time warning
  if (app.clocks[topColor] <= 30 && app.clocks[topColor] > 0) clockTop.classList.add('low-time');
  if (app.clocks[bottomColor] <= 30 && app.clocks[bottomColor] > 0) clockBottom.classList.add('low-time');
  
  // Hide clocks if no time control
  const showClocks = app.timeControl.minutes > 0;
  clockTop.style.display = showClocks ? '' : 'none';
  clockBottom.style.display = showClocks ? '' : 'none';
}

// ── UI Updates ─────────────────────────────────────────────────
function updateMoveList() {
  const list = document.getElementById('move-list');
  const moves = app.game.sanHistory;
  
  if (moves.length === 0) {
    list.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding: 20px 0;">Game moves will appear here</div>';
    document.getElementById('move-count').textContent = '0 moves';
    return;
  }
  
  let html = '';
  for (let i = 0; i < moves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const isCurrent = i === moves.length - 1 || i + 1 === moves.length - 1;
    html += `<div class="move-row">
      <span class="move-number">${moveNum}.</span>
      <span class="move-san${i === moves.length - 1 ? ' current' : ''}">${moves[i]}</span>
      ${moves[i + 1] ? `<span class="move-san${i + 1 === moves.length - 1 ? ' current' : ''}">${moves[i + 1]}</span>` : ''}
    </div>`;
  }
  
  list.innerHTML = html;
  list.scrollTop = list.scrollHeight;
  document.getElementById('move-count').textContent = `${moves.length} move${moves.length !== 1 ? 's' : ''}`;
}

const PIECE_UNICODE = {
  p: { w: '♙', b: '♟' },
  n: { w: '♘', b: '♞' },
  b: { w: '♗', b: '♝' },
  r: { w: '♖', b: '♜' },
  q: { w: '♕', b: '♛' },
  k: { w: '♔', b: '♚' }
};

function updatePlayerBars() {
  const turn = app.game.getTurn();
  const topColor = app.flipped ? WHITE : BLACK;
  const bottomColor = app.flipped ? BLACK : WHITE;
  
  // Active player highlight
  document.getElementById('player-top').className = 'player-bar' + (turn === topColor ? ' active' : '');
  document.getElementById('player-bottom').className = 'player-bar' + (turn === bottomColor ? ' active' : '');
  
  // Player names
  const topName = app.mode === 'bot' && topColor !== app.playerColor
    ? `🤖 Bot (${app.difficulty})`
    : (topColor === WHITE ? 'White' : 'Black');
  const bottomName = app.mode === 'bot' && bottomColor !== app.playerColor
    ? `🤖 Bot (${app.difficulty})`
    : (bottomColor === WHITE ? 'White' : 'Black');
  
  document.getElementById('name-top').textContent = topName;
  document.getElementById('name-bottom').textContent = bottomName;
  
  // Captured pieces
  updateCapturedPieces(topColor, bottomColor);
}

function updateCapturedPieces(topColor, bottomColor) {
  // Top player shows pieces they captured (opponent's pieces)
  const topCaptured = app.game.capturedPieces[bottomColor]; // pieces belonging to bottom player that were captured
  const bottomCaptured = app.game.capturedPieces[topColor];
  
  const renderCaptures = (pieces, targetColor) => {
    const sorted = [...pieces].sort((a, b) => (PIECE_VALUES[b.type] || 0) - (PIECE_VALUES[a.type] || 0));
    return sorted.map(p => PIECE_UNICODE[p.type]?.[p.color] || '?').join('');
  };
  
  const topMaterial = topCaptured.reduce((s, p) => s + (PIECE_VALUES[p.type] || 0), 0);
  const bottomMaterial = bottomCaptured.reduce((s, p) => s + (PIECE_VALUES[p.type] || 0), 0);
  const diff = topMaterial - bottomMaterial;
  
  document.getElementById('captured-top').innerHTML = 
    renderCaptures(topCaptured) + (diff > 0 ? `<span class="material-diff">+${diff / 100}</span>` : '');
  document.getElementById('captured-bottom').innerHTML = 
    renderCaptures(bottomCaptured) + (diff < 0 ? `<span class="material-diff">+${Math.abs(diff) / 100}</span>` : '');
}

function updateStatus() {
  const statusEl = document.getElementById('status-text');
  const dotEl = document.getElementById('turn-dot');
  
  if (app.game.isGameOver()) {
    const result = app.game.gameResult;
    const msgs = {
      checkmate: `Checkmate! ${app.game.winner === WHITE ? 'White' : 'Black'} wins!`,
      stalemate: 'Draw by stalemate!',
      '50move': 'Draw by 50-move rule!',
      insufficient: 'Draw by insufficient material!',
      threefold: 'Draw by threefold repetition!',
      timeout: `Time out! ${app.game.winner === WHITE ? 'White' : 'Black'} wins!`,
      resignation: `${app.game.winner === WHITE ? 'White' : 'Black'} wins by resignation!`
    };
    statusEl.textContent = msgs[result] || 'Game over';
    return;
  }
  
  if (app.botThinking) {
    statusEl.textContent = '🤔 Bot is thinking...';
    return;
  }
  
  const turn = app.game.getTurn();
  dotEl.className = 'turn-dot ' + (turn === WHITE ? 'white' : 'black');
  
  let text = turn === WHITE ? 'White' : 'Black';
  text += ' to move';
  if (app.game.isInCheck()) text += ' — Check!';
  statusEl.textContent = text;
}

// ── Game Over ──────────────────────────────────────────────────
function handleGameOver() {
  stopClock();
  
  const banner = document.getElementById('game-over-banner');
  const title = document.getElementById('game-over-title');
  const msg = document.getElementById('game-over-message');
  
  const result = app.game.gameResult;
  
  if (result === 'checkmate') {
    title.textContent = '♛ Checkmate!';
    msg.textContent = `${app.game.winner === WHITE ? 'White' : 'Black'} wins the game`;
  } else if (result === 'timeout') {
    title.textContent = '⏱ Time Out!';
    msg.textContent = `${app.game.winner === WHITE ? 'White' : 'Black'} wins on time`;
  } else if (result === 'resignation') {
    title.textContent = '🏳 Resignation';
    msg.textContent = `${app.game.winner === WHITE ? 'White' : 'Black'} wins by resignation`;
  } else {
    title.textContent = '½ Draw';
    const reasons = {
      stalemate: 'by stalemate',
      '50move': 'by 50-move rule',
      insufficient: 'by insufficient material',
      threefold: 'by threefold repetition',
      agreed: 'by agreement'
    };
    msg.textContent = `Game drawn ${reasons[result] || ''}`;
  }
  
  requestAnimationFrame(() => banner.classList.add('active'));
  updateStatus();
  updateClockDisplay();
  renderBoard();
}

// ── UI Event Handlers ──────────────────────────────────────────
function setupUIEvents() {
  // New Game button
  document.getElementById('btn-new-game').addEventListener('click', () => {
    document.getElementById('new-game-modal').classList.add('active');
  });
  
  // Undo
  document.getElementById('btn-undo').addEventListener('click', () => {
    // In bot mode, undo two moves (player + bot)
    if (app.mode === 'bot' && !app.botThinking) {
      app.game.undo(); // Undo bot's move
      app.game.undo(); // Undo player's move
    } else if (app.mode === 'pvp') {
      app.game.undo();
    }
    document.getElementById('game-over-banner').classList.remove('active');
    updateMoveList();
    updatePlayerBars();
    updateStatus();
    renderBoard();
  });
  
  // Flip board
  document.getElementById('btn-flip').addEventListener('click', () => {
    app.flipped = !app.flipped;
    app.renderer.flip();
    updatePlayerBars();
    updateClockDisplay();
    renderBoard();
  });
  
  // Resign
  document.getElementById('btn-resign').addEventListener('click', () => {
    if (app.game.isGameOver()) return;
    const turn = app.game.getTurn();
    app.game.gameResult = 'resignation';
    app.game.winner = turn === WHITE ? BLACK : WHITE;
    handleGameOver();
  });
  
  // Draw
  document.getElementById('btn-draw').addEventListener('click', () => {
    if (app.game.isGameOver()) return;
    if (app.mode === 'pvp') {
      app.game.gameResult = 'agreed';
      handleGameOver();
    }
  });
  
  // Export PGN
  document.getElementById('btn-export').addEventListener('click', () => {
    const pgn = app.game.exportPGN();
    if (pgn) {
      navigator.clipboard.writeText(pgn).then(() => {
        const btn = document.getElementById('btn-export');
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = '📋 PGN'; }, 1500);
      });
    }
  });
  
  // Theme toggle (dark/light)
  document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    const isDark = app.themes.toggleDarkMode();
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.getElementById('btn-theme-toggle').textContent = isDark ? '🌙' : '☀️';
  });
  
  // Sound toggle
  document.getElementById('btn-sound-toggle').addEventListener('click', () => {
    const muted = app.sounds.toggleMute();
    document.getElementById('btn-sound-toggle').textContent = muted ? '🔇' : '🔊';
  });
}

// ── Board Theme Selector ───────────────────────────────────────
function setupThemeSelector() {
  const selector = document.getElementById('theme-selector');
  
  // Set initial selection
  const current = app.themes.currentTheme;
  selector.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.theme === current);
  });
  
  selector.addEventListener('click', (e) => {
    const btn = e.target.closest('.option-btn');
    if (!btn || !btn.dataset.theme) return;
    
    selector.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    app.themes.setTheme(btn.dataset.theme);
    renderBoard();
  });
}

// ── New Game Modal ─────────────────────────────────────────────
function setupModalEvents() {
  const modal = document.getElementById('new-game-modal');
  
  // Option buttons
  modal.addEventListener('click', (e) => {
    const btn = e.target.closest('.option-btn');
    if (!btn) return;
    
    const option = btn.dataset.option;
    const value = btn.dataset.value;
    if (!option) return;
    
    // Deselect siblings
    btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    app.modalOptions[option] = value;
    
    // Show/hide difficulty + color when mode changes
    if (option === 'mode') {
      document.getElementById('difficulty-group').style.display = value === 'bot' ? '' : 'none';
      document.getElementById('color-group').style.display = value === 'bot' ? '' : 'none';
    }
  });
  
  // Start game
  document.getElementById('btn-modal-start').addEventListener('click', () => {
    const opts = app.modalOptions;
    
    app.mode = opts.mode;
    app.difficulty = opts.difficulty;
    
    // Parse time control
    const [min, inc] = opts.time.split('|').map(Number);
    app.timeControl = { minutes: min, increment: inc };
    
    // Player color
    if (opts.mode === 'bot') {
      if (opts.color === 'random') {
        app.playerColor = Math.random() < 0.5 ? WHITE : BLACK;
      } else {
        app.playerColor = opts.color;
      }
      app.flipped = app.playerColor === BLACK;
      if (app.flipped) app.renderer.flipped = true;
    } else {
      app.playerColor = WHITE;
      app.flipped = false;
      app.renderer.flipped = false;
    }
    
    // Reset game
    app.game.reset();
    resetClocks();
    document.getElementById('game-over-banner').classList.remove('active');
    app.botThinking = false;
    
    // Update UI
    updateMoveList();
    updatePlayerBars();
    updateStatus();
    renderBoard();
    
    // Close modal
    modal.classList.remove('active');
    
    // If playing as black, bot goes first
    if (app.mode === 'bot' && app.playerColor === BLACK) {
      scheduleBotMove();
    }
  });
  
  // Cancel
  document.getElementById('btn-modal-cancel').addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

// ── Start ──────────────────────────────────────────────────────
init();
