
// --- src/engine/constants.js ---
// ── Chess Engine Constants ──────────────────────────────────────

const WHITE = 'w';
const BLACK = 'b';

const PAWN   = 'p';
const KNIGHT = 'n';
const BISHOP = 'b';
const ROOK   = 'r';
const QUEEN  = 'q';
const KING   = 'k';

const PIECE_VALUES = {
  [PAWN]:   100,
  [KNIGHT]: 320,
  [BISHOP]: 330,
  [ROOK]:   500,
  [QUEEN]:  900,
  [KING]:   20000
};

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['1','2','3','4','5','6','7','8'];

// Starting position FEN
const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Direction offsets for sliding pieces (row, col)
const DIRECTIONS = {
  N:  [-1,  0],
  S:  [ 1,  0],
  E:  [ 0,  1],
  W:  [ 0, -1],
  NE: [-1,  1],
  NW: [-1, -1],
  SE: [ 1,  1],
  SW: [ 1, -1]
};

const ROOK_DIRS   = [DIRECTIONS.N, DIRECTIONS.S, DIRECTIONS.E, DIRECTIONS.W];
const BISHOP_DIRS = [DIRECTIONS.NE, DIRECTIONS.NW, DIRECTIONS.SE, DIRECTIONS.SW];
const QUEEN_DIRS  = [...ROOK_DIRS, ...BISHOP_DIRS];

const KNIGHT_OFFSETS = [
  [-2, -1], [-2,  1],
  [-1, -2], [-1,  2],
  [ 1, -2], [ 1,  2],
  [ 2, -1], [ 2,  1]
];

const KING_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1]
];

/**
 * Piece-Square Tables for positional evaluation
 * Values from white's perspective (for black, mirror vertically)
 */
const PST = {
  [PAWN]: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0]
  ],
  [KNIGHT]: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  [BISHOP]: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  [ROOK]: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 0,  0,  0,  5,  5,  0,  0,  0]
  ],
  [QUEEN]: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  [KING]: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
  ],
  // King endgame table (when few pieces remain)
  king_end: [
    [-50,-40,-30,-20,-20,-30,-40,-50],
    [-30,-20,-10,  0,  0,-10,-20,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-30,  0,  0,  0,  0,-30,-30],
    [-50,-30,-30,-30,-30,-30,-30,-50]
  ]
};


// --- src/engine/board.js ---
// ── Chess Board Representation ─────────────────────────────────


/**
 * Piece object: { type: 'p'|'n'|'b'|'r'|'q'|'k', color: 'w'|'b' }
 * Board is 8x8 array: board[row][col], row 0 = rank 8, row 7 = rank 1
 */

function createPiece(type, color) {
  return { type, color };
}

function createBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function cloneBoard(board) {
  return board.map(row => row.map(sq => sq ? { ...sq } : null));
}

function rowColToAlgebraic(row, col) {
  return FILES[col] + RANKS[7 - row];
}

function algebraicToRowCol(sq) {
  const col = FILES.indexOf(sq[0]);
  const row = 7 - RANKS.indexOf(sq[1]);
  return [row, col];
}

function isInBounds(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Parse a FEN string into a game state object
 */
function parseFEN(fen) {
  const parts = fen.split(' ');
  const board = createBoard();
  
  const rows = parts[0].split('/');
  for (let r = 0; r < 8; r++) {
    let c = 0;
    for (const ch of rows[r]) {
      if (ch >= '1' && ch <= '8') {
        c += parseInt(ch);
      } else {
        const color = ch === ch.toUpperCase() ? WHITE : BLACK;
        const type = ch.toLowerCase();
        board[r][c] = createPiece(type, color);
        c++;
      }
    }
  }
  
  const turn = parts[1] || 'w';
  const castling = parts[2] || 'KQkq';
  const enPassant = parts[3] || '-';
  const halfMove = parseInt(parts[4]) || 0;
  const fullMove = parseInt(parts[5]) || 1;
  
  return {
    board,
    turn,
    castling,
    enPassant,
    halfMove,
    fullMove
  };
}

/**
 * Convert game state back to FEN string
 */
function toFEN(state) {
  let fen = '';
  
  for (let r = 0; r < 8; r++) {
    let empty = 0;
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (!piece) {
        empty++;
      } else {
        if (empty > 0) { fen += empty; empty = 0; }
        const ch = piece.color === WHITE ? piece.type.toUpperCase() : piece.type;
        fen += ch;
      }
    }
    if (empty > 0) fen += empty;
    if (r < 7) fen += '/';
  }
  
  fen += ` ${state.turn} ${state.castling || '-'} ${state.enPassant || '-'} ${state.halfMove} ${state.fullMove}`;
  return fen;
}

/**
 * Find the position of a king
 */
function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === KING && p.color === color) {
        return [r, c];
      }
    }
  }
  return null;
}

/**
 * Get all pieces of a given color
 */
function getPieces(board, color) {
  const pieces = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === color) {
        pieces.push({ piece: p, row: r, col: c });
      }
    }
  }
  return pieces;
}


// --- src/engine/moves.js ---
// ── Move Generation & Validation ───────────────────────────────



/**
 * Check if a square is attacked by the given color
 */
function isSquareAttacked(board, row, col, byColor) {
  // Pawn attacks
  const pawnDir = byColor === WHITE ? 1 : -1;
  for (const dc of [-1, 1]) {
    const pr = row + pawnDir, pc = col + dc;
    if (isInBounds(pr, pc)) {
      const p = board[pr][pc];
      if (p && p.type === PAWN && p.color === byColor) return true;
    }
  }
  
  // Knight attacks
  for (const [dr, dc] of KNIGHT_OFFSETS) {
    const nr = row + dr, nc = col + dc;
    if (isInBounds(nr, nc)) {
      const p = board[nr][nc];
      if (p && p.type === KNIGHT && p.color === byColor) return true;
    }
  }
  
  // King attacks
  for (const [dr, dc] of KING_OFFSETS) {
    const kr = row + dr, kc = col + dc;
    if (isInBounds(kr, kc)) {
      const p = board[kr][kc];
      if (p && p.type === KING && p.color === byColor) return true;
    }
  }
  
  // Rook / Queen (straight)
  for (const [dr, dc] of ROOK_DIRS) {
    let r = row + dr, c = col + dc;
    while (isInBounds(r, c)) {
      const p = board[r][c];
      if (p) {
        if (p.color === byColor && (p.type === ROOK || p.type === QUEEN)) return true;
        break;
      }
      r += dr; c += dc;
    }
  }
  
  // Bishop / Queen (diagonal)
  for (const [dr, dc] of BISHOP_DIRS) {
    let r = row + dr, c = col + dc;
    while (isInBounds(r, c)) {
      const p = board[r][c];
      if (p) {
        if (p.color === byColor && (p.type === BISHOP || p.type === QUEEN)) return true;
        break;
      }
      r += dr; c += dc;
    }
  }
  
  return false;
}

/**
 * Is the given color's king in check?
 */
function isInCheck(board, color) {
  const king = findKing(board, color);
  if (!king) return false;
  const enemy = color === WHITE ? BLACK : WHITE;
  return isSquareAttacked(board, king[0], king[1], enemy);
}

/**
 * Generate all pseudo-legal moves (may leave king in check)
 */
function generatePseudoMoves(state) {
  const { board, turn, castling, enPassant } = state;
  const moves = [];
  const enemy = turn === WHITE ? BLACK : WHITE;
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== turn) continue;
      
      switch (piece.type) {
        case PAWN: {
          const dir = turn === WHITE ? -1 : 1;
          const startRow = turn === WHITE ? 6 : 1;
          const promoRow = turn === WHITE ? 0 : 7;
          
          // Forward one
          const fr = r + dir;
          if (isInBounds(fr, c) && !board[fr][c]) {
            if (fr === promoRow) {
              for (const pt of [QUEEN, ROOK, BISHOP, KNIGHT]) {
                moves.push({ from: [r, c], to: [fr, c], promotion: pt });
              }
            } else {
              moves.push({ from: [r, c], to: [fr, c] });
            }
            
            // Forward two from start
            const fr2 = r + dir * 2;
            if (r === startRow && !board[fr2][c]) {
              moves.push({ from: [r, c], to: [fr2, c] });
            }
          }
          
          // Captures
          for (const dc of [-1, 1]) {
            const cr = r + dir, cc = c + dc;
            if (!isInBounds(cr, cc)) continue;
            const target = board[cr][cc];
            if (target && target.color === enemy) {
              if (cr === promoRow) {
                for (const pt of [QUEEN, ROOK, BISHOP, KNIGHT]) {
                  moves.push({ from: [r, c], to: [cr, cc], promotion: pt, capture: target });
                }
              } else {
                moves.push({ from: [r, c], to: [cr, cc], capture: target });
              }
            }
            
            // En passant
            if (enPassant && enPassant !== '-') {
              const [epr, epc] = algebraicToRowCol(enPassant);
              if (cr === epr && cc === epc) {
                moves.push({ from: [r, c], to: [cr, cc], enPassant: true, capture: board[r][cc] });
              }
            }
          }
          break;
        }
        
        case KNIGHT: {
          for (const [dr, dc] of KNIGHT_OFFSETS) {
            const nr = r + dr, nc = c + dc;
            if (!isInBounds(nr, nc)) continue;
            const target = board[nr][nc];
            if (target && target.color === turn) continue;
            moves.push({ from: [r, c], to: [nr, nc], capture: target || undefined });
          }
          break;
        }
        
        case BISHOP: {
          addSlidingMoves(board, r, c, turn, BISHOP_DIRS, moves);
          break;
        }
        
        case ROOK: {
          addSlidingMoves(board, r, c, turn, ROOK_DIRS, moves);
          break;
        }
        
        case QUEEN: {
          addSlidingMoves(board, r, c, turn, QUEEN_DIRS, moves);
          break;
        }
        
        case KING: {
          for (const [dr, dc] of KING_OFFSETS) {
            const kr = r + dr, kc = c + dc;
            if (!isInBounds(kr, kc)) continue;
            const target = board[kr][kc];
            if (target && target.color === turn) continue;
            moves.push({ from: [r, c], to: [kr, kc], capture: target || undefined });
          }
          
          // Castling
          if (!isInCheck(board, turn)) {
            const row = turn === WHITE ? 7 : 0;
            if (r === row && c === 4) {
              // Kingside
              const ksChar = turn === WHITE ? 'K' : 'k';
              if (castling.includes(ksChar)
                  && !board[row][5] && !board[row][6]
                  && board[row][7] && board[row][7].type === ROOK && board[row][7].color === turn
                  && !isSquareAttacked(board, row, 5, enemy)
                  && !isSquareAttacked(board, row, 6, enemy)) {
                moves.push({ from: [row, 4], to: [row, 6], castle: 'K' });
              }
              // Queenside
              const qsChar = turn === WHITE ? 'Q' : 'q';
              if (castling.includes(qsChar)
                  && !board[row][3] && !board[row][2] && !board[row][1]
                  && board[row][0] && board[row][0].type === ROOK && board[row][0].color === turn
                  && !isSquareAttacked(board, row, 3, enemy)
                  && !isSquareAttacked(board, row, 2, enemy)) {
                moves.push({ from: [row, 4], to: [row, 2], castle: 'Q' });
              }
            }
          }
          break;
        }
      }
    }
  }
  
  return moves;
}

function addSlidingMoves(board, r, c, color, directions, moves) {
  for (const [dr, dc] of directions) {
    let nr = r + dr, nc = c + dc;
    while (isInBounds(nr, nc)) {
      const target = board[nr][nc];
      if (target) {
        if (target.color !== color) {
          moves.push({ from: [r, c], to: [nr, nc], capture: target });
        }
        break;
      }
      moves.push({ from: [r, c], to: [nr, nc] });
      nr += dr; nc += dc;
    }
  }
}

/**
 * Make a move on a cloned board, returns new state
 */
function makeMove(state, move) {
  const newBoard = cloneBoard(state.board);
  const { from, to } = move;
  const piece = newBoard[from[0]][from[1]];
  const enemy = state.turn === WHITE ? BLACK : WHITE;
  
  // Update castling rights
  let newCastling = state.castling;
  
  // King moves remove all castling for that side
  if (piece.type === KING) {
    if (state.turn === WHITE) {
      newCastling = newCastling.replace('K', '').replace('Q', '');
    } else {
      newCastling = newCastling.replace('k', '').replace('q', '');
    }
  }
  
  // Rook moves or captures remove specific castling
  if (piece.type === ROOK) {
    if (from[0] === 7 && from[1] === 0) newCastling = newCastling.replace('Q', '');
    if (from[0] === 7 && from[1] === 7) newCastling = newCastling.replace('K', '');
    if (from[0] === 0 && from[1] === 0) newCastling = newCastling.replace('q', '');
    if (from[0] === 0 && from[1] === 7) newCastling = newCastling.replace('k', '');
  }
  
  // Capture of rook removes its castling right
  if (to[0] === 7 && to[1] === 0) newCastling = newCastling.replace('Q', '');
  if (to[0] === 7 && to[1] === 7) newCastling = newCastling.replace('K', '');
  if (to[0] === 0 && to[1] === 0) newCastling = newCastling.replace('q', '');
  if (to[0] === 0 && to[1] === 7) newCastling = newCastling.replace('k', '');
  
  if (newCastling === '') newCastling = '-';
  
  // En passant capture
  if (move.enPassant) {
    newBoard[from[0]][to[1]] = null; // Remove captured pawn
  }
  
  // Castling — move the rook
  if (move.castle) {
    const row = from[0];
    if (move.castle === 'K') {
      newBoard[row][5] = newBoard[row][7];
      newBoard[row][7] = null;
    } else {
      newBoard[row][3] = newBoard[row][0];
      newBoard[row][0] = null;
    }
  }
  
  // Move the piece
  newBoard[to[0]][to[1]] = piece;
  newBoard[from[0]][from[1]] = null;
  
  // Promotion
  if (move.promotion) {
    newBoard[to[0]][to[1]] = { type: move.promotion, color: piece.color };
  }
  
  // En passant square
  let newEP = '-';
  if (piece.type === PAWN && Math.abs(to[0] - from[0]) === 2) {
    const epRow = (from[0] + to[0]) / 2;
    newEP = rowColToAlgebraic(epRow, from[1]);
  }
  
  // Half-move clock
  const newHalfMove = (piece.type === PAWN || move.capture) ? 0 : state.halfMove + 1;
  const newFullMove = state.turn === BLACK ? state.fullMove + 1 : state.fullMove;
  
  return {
    board: newBoard,
    turn: enemy,
    castling: newCastling,
    enPassant: newEP,
    halfMove: newHalfMove,
    fullMove: newFullMove
  };
}

/**
 * Generate all legal moves for the current position
 */
function generateLegalMoves(state) {
  const pseudo = generatePseudoMoves(state);
  const legal = [];
  
  for (const move of pseudo) {
    const newState = makeMove(state, move);
    // Move is legal if it doesn't leave our king in check
    if (!isInCheck(newState.board, state.turn)) {
      legal.push(move);
    }
  }
  
  return legal;
}

/**
 * Get legal moves for a specific square
 */
function getLegalMovesForSquare(state, row, col) {
  return generateLegalMoves(state).filter(
    m => m.from[0] === row && m.from[1] === col
  );
}

/**
 * Convert a move to algebraic notation (SAN)
 */
function moveToSAN(state, move) {
  const piece = state.board[move.from[0]][move.from[1]];
  
  // Castling
  if (move.castle === 'K') return 'O-O';
  if (move.castle === 'Q') return 'O-O-O';
  
  let san = '';
  
  // Piece letter (not for pawns)
  if (piece.type !== PAWN) {
    san += piece.type.toUpperCase();
    
    // Disambiguation
    const allMoves = generateLegalMoves(state);
    const ambiguous = allMoves.filter(m => {
      const p = state.board[m.from[0]][m.from[1]];
      return p.type === piece.type
        && m.to[0] === move.to[0] && m.to[1] === move.to[1]
        && (m.from[0] !== move.from[0] || m.from[1] !== move.from[1]);
    });
    
    if (ambiguous.length > 0) {
      const sameFile = ambiguous.some(m => m.from[1] === move.from[1]);
      const sameRank = ambiguous.some(m => m.from[0] === move.from[0]);
      if (!sameFile) {
        san += FILES[move.from[1]];
      } else if (!sameRank) {
        san += RANKS[7 - move.from[0]];
      } else {
        san += FILES[move.from[1]] + RANKS[7 - move.from[0]];
      }
    }
  }
  
  // Capture
  if (move.capture || move.enPassant) {
    if (piece.type === PAWN) san += FILES[move.from[1]];
    san += 'x';
  }
  
  // Target square
  san += rowColToAlgebraic(move.to[0], move.to[1]);
  
  // Promotion
  if (move.promotion) {
    san += '=' + move.promotion.toUpperCase();
  }
  
  // Check / Checkmate
  const newState = makeMove(state, move);
  const enemyMoves = generateLegalMoves(newState);
  if (isInCheck(newState.board, newState.turn)) {
    san += enemyMoves.length === 0 ? '#' : '+';
  }
  
  return san;
}

/**
 * Detect game result
 * Returns: null (ongoing), 'checkmate', 'stalemate', '50move', 'insufficient', 'threefold'
 */
function getGameResult(state, positionHistory) {
  const legalMoves = generateLegalMoves(state);
  
  if (legalMoves.length === 0) {
    return isInCheck(state.board, state.turn) ? 'checkmate' : 'stalemate';
  }
  
  // 50-move rule
  if (state.halfMove >= 100) return '50move';
  
  // Insufficient material
  if (isInsufficientMaterial(state.board)) return 'insufficient';
  
  // Threefold repetition
  if (positionHistory) {
    const currentFENPos = state.board.map(row => 
      row.map(p => p ? `${p.color}${p.type}` : '--').join('')
    ).join('') + state.turn + state.castling + state.enPassant;
    
    let count = 0;
    for (const pos of positionHistory) {
      if (pos === currentFENPos) count++;
    }
    if (count >= 3) return 'threefold';
  }
  
  return null;
}

function isInsufficientMaterial(board) {
  const pieces = { w: [], b: [] };
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type !== KING) {
        pieces[p.color].push({ type: p.type, row: r, col: c });
      }
    }
  }
  
  const wp = pieces.w, bp = pieces.b;
  
  // K vs K
  if (wp.length === 0 && bp.length === 0) return true;
  
  // K vs K+B or K vs K+N
  if (wp.length === 0 && bp.length === 1 && (bp[0].type === BISHOP || bp[0].type === KNIGHT)) return true;
  if (bp.length === 0 && wp.length === 1 && (wp[0].type === BISHOP || wp[0].type === KNIGHT)) return true;
  
  // K+B vs K+B (same color bishops)
  if (wp.length === 1 && bp.length === 1 && wp[0].type === BISHOP && bp[0].type === BISHOP) {
    const wBishopColor = (wp[0].row + wp[0].col) % 2;
    const bBishopColor = (bp[0].row + bp[0].col) % 2;
    if (wBishopColor === bBishopColor) return true;
  }
  
  return false;
}


// --- src/engine/game.js ---
// ── Game State Controller ──────────────────────────────────────




class GameController {
  constructor() {
    this.reset();
    this.onMove = null;        // callback(move, san, state)
    this.onGameOver = null;    // callback(result, winner)
    this.onStateChange = null; // callback(state)
  }
  
  reset(fen = INITIAL_FEN) {
    this.state = parseFEN(fen);
    this.moveHistory = [];
    this.sanHistory = [];
    this.stateHistory = [this._positionKey()];
    this.capturedPieces = { w: [], b: [] };
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.gameResult = null;
    this.winner = null;
    this.moveIndex = -1;
    this.historyStates = [{ ...this.state, board: cloneBoard(this.state.board) }];
  }
  
  _positionKey() {
    return this.state.board.map(row =>
      row.map(p => p ? `${p.color}${p.type}` : '--').join('')
    ).join('') + this.state.turn + this.state.castling + this.state.enPassant;
  }
  
  getState() { return this.state; }
  getTurn() { return this.state.turn; }
  isGameOver() { return this.gameResult !== null; }
  
  getLegalMoves() {
    return generateLegalMoves(this.state);
  }
  
  selectSquare(row, col) {
    const piece = this.state.board[row][col];
    
    // If we already have a selected piece, try to move
    if (this.selectedSquare) {
      const move = this.legalMovesForSelected.find(
        m => m.to[0] === row && m.to[1] === col
      );
      
      if (move) {
        // Check for promotion — we'll return promotions for the UI to handle
        const isPromotion = this.legalMovesForSelected.some(
          m => m.to[0] === row && m.to[1] === col && m.promotion
        );
        
        if (isPromotion) {
          return { type: 'promotion', from: this.selectedSquare, to: [row, col] };
        }
        
        this.executeMove(move);
        return { type: 'moved' };
      }
      
      // Clicking on own piece — switch selection
      if (piece && piece.color === this.state.turn) {
        this.selectedSquare = [row, col];
        this.legalMovesForSelected = getLegalMovesForSquare(this.state, row, col);
        return { type: 'selected', square: [row, col], moves: this.legalMovesForSelected };
      }
      
      // Clicking empty square or enemy with no valid move — deselect
      this.selectedSquare = null;
      this.legalMovesForSelected = [];
      return { type: 'deselected' };
    }
    
    // No selection — select own piece
    if (piece && piece.color === this.state.turn) {
      this.selectedSquare = [row, col];
      this.legalMovesForSelected = getLegalMovesForSquare(this.state, row, col);
      return { type: 'selected', square: [row, col], moves: this.legalMovesForSelected };
    }
    
    return { type: 'none' };
  }
  
  executeMove(move) {
    if (this.gameResult) return false;
    
    const san = moveToSAN(this.state, move);
    
    // Track captures
    if (move.capture) {
      this.capturedPieces[move.capture.color].push(move.capture);
    }
    
    this.state = makeMove(this.state, move);
    this.moveHistory.push(move);
    this.sanHistory.push(san);
    this.stateHistory.push(this._positionKey());
    this.moveIndex = this.moveHistory.length - 1;
    this.historyStates.push({ ...this.state, board: cloneBoard(this.state.board) });
    
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    
    // Check game result
    const result = getGameResult(this.state, this.stateHistory);
    if (result) {
      this.gameResult = result;
      if (result === 'checkmate') {
        this.winner = this.state.turn === WHITE ? BLACK : WHITE;
      }
      if (this.onGameOver) this.onGameOver(result, this.winner);
    }
    
    if (this.onMove) this.onMove(move, san, this.state);
    if (this.onStateChange) this.onStateChange(this.state);
    
    return true;
  }
  
  executePromotion(from, to, promotionPiece) {
    const move = this.legalMovesForSelected.find(
      m => m.to[0] === to[0] && m.to[1] === to[1] && m.promotion === promotionPiece
    );
    if (move) {
      this.executeMove(move);
      return true;
    }
    return false;
  }
  
  /**
   * Try to move by drag-and-drop coordinates
   */
  tryMove(fromRow, fromCol, toRow, toCol) {
    const moves = getLegalMovesForSquare(this.state, fromRow, fromCol);
    
    // Check for promotion
    const promoMoves = moves.filter(
      m => m.to[0] === toRow && m.to[1] === toCol && m.promotion
    );
    if (promoMoves.length > 0) {
      this.selectedSquare = [fromRow, fromCol];
      this.legalMovesForSelected = moves;
      return { type: 'promotion', from: [fromRow, fromCol], to: [toRow, toCol] };
    }
    
    const move = moves.find(m => m.to[0] === toRow && m.to[1] === toCol);
    if (move) {
      this.executeMove(move);
      return { type: 'moved' };
    }
    return { type: 'invalid' };
  }
  
  undo() {
    if (this.moveHistory.length === 0) return false;
    this.moveHistory.pop();
    this.sanHistory.pop();
    this.stateHistory.pop();
    this.historyStates.pop();
    this.moveIndex = this.moveHistory.length - 1;
    
    // Restore captured pieces
    const lastMove = this.moveHistory[this.moveHistory.length];
    
    // Re-parse from history
    this.state = { ...this.historyStates[this.historyStates.length - 1], board: cloneBoard(this.historyStates[this.historyStates.length - 1].board) };
    this.gameResult = null;
    this.winner = null;
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    
    // Recalculate captured pieces
    this.capturedPieces = { w: [], b: [] };
    for (const m of this.moveHistory) {
      if (m.capture) {
        this.capturedPieces[m.capture.color].push(m.capture);
      }
    }
    
    if (this.onStateChange) this.onStateChange(this.state);
    return true;
  }
  
  isInCheck() {
    return isInCheck(this.state.board, this.state.turn);
  }
  
  getLastMove() {
    return this.moveHistory.length > 0 ? this.moveHistory[this.moveHistory.length - 1] : null;
  }
  
  exportPGN() {
    let pgn = '';
    for (let i = 0; i < this.sanHistory.length; i++) {
      if (i % 2 === 0) pgn += `${Math.floor(i / 2) + 1}. `;
      pgn += this.sanHistory[i] + ' ';
    }
    if (this.gameResult) {
      if (this.gameResult === 'checkmate') {
        pgn += this.winner === WHITE ? '1-0' : '0-1';
      } else {
        pgn += '1/2-1/2';
      }
    }
    return pgn.trim();
  }
}


// --- src/ai/engine.js ---
// ── Chess AI — Minimax with Alpha-Beta Pruning ─────────────────




/**
 * Evaluate a position from white's perspective
 */
function evaluate(state) {
  const board = state.board;
  let score = 0;
  let totalPieces = 0;
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      totalPieces++;
      
      const value = PIECE_VALUES[piece.type] || 0;
      
      // Positional bonus from piece-square tables
      let pstRow, pstCol;
      if (piece.color === WHITE) {
        pstRow = r;
        pstCol = c;
      } else {
        pstRow = 7 - r;
        pstCol = c;
      }
      
      // Use endgame king table if few pieces
      let table;
      if (piece.type === KING && totalPieces <= 12) {
        table = PST.king_end;
      } else {
        table = PST[piece.type];
      }
      
      const positional = table ? table[pstRow][pstCol] : 0;
      
      if (piece.color === WHITE) {
        score += value + positional;
      } else {
        score -= value + positional;
      }
    }
  }
  
  // Mobility bonus
  const currentMoves = generateLegalMoves(state);
  const mobilityBonus = currentMoves.length * 2;
  score += state.turn === WHITE ? mobilityBonus : -mobilityBonus;
  
  return score;
}

/**
 * Order moves to improve alpha-beta pruning efficiency
 */
function orderMoves(moves, state) {
  return moves.sort((a, b) => {
    let scoreA = 0, scoreB = 0;
    
    // Captures first (MVV-LVA)
    if (a.capture) scoreA += 10000 + (PIECE_VALUES[a.capture.type] || 0) - (PIECE_VALUES[state.board[a.from[0]][a.from[1]].type] || 0);
    if (b.capture) scoreB += 10000 + (PIECE_VALUES[b.capture.type] || 0) - (PIECE_VALUES[state.board[b.from[0]][b.from[1]].type] || 0);
    
    // Promotions
    if (a.promotion) scoreA += 9000;
    if (b.promotion) scoreB += 9000;
    
    // Check moves
    if (a.castle) scoreA += 500;
    if (b.castle) scoreB += 500;
    
    return scoreB - scoreA;
  });
}

/**
 * Quiescence search — evaluate captures to avoid horizon effect
 */
function quiescence(state, alpha, beta, color) {
  const standPat = evaluate(state) * color;
  
  if (standPat >= beta) return beta;
  if (alpha < standPat) alpha = standPat;
  
  const moves = generateLegalMoves(state).filter(m => m.capture);
  const sorted = orderMoves(moves, state);
  
  for (const move of sorted) {
    const newState = makeMove(state, move);
    const score = -quiescence(newState, -beta, -alpha, -color);
    
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  
  return alpha;
}

/**
 * Minimax with alpha-beta pruning
 */
function minimax(state, depth, alpha, beta, color, useQuiescence) {
  if (depth === 0) {
    return useQuiescence
      ? quiescence(state, alpha, beta, color)
      : evaluate(state) * color;
  }
  
  const moves = generateLegalMoves(state);
  
  if (moves.length === 0) {
    // Checkmate or stalemate
    if (isInCheck(state.board, state.turn)) {
      return -100000 + (10 - depth); // Prefer quicker mates
    }
    return 0; // Stalemate
  }
  
  const sorted = orderMoves(moves, state);
  let best = -Infinity;
  
  for (const move of sorted) {
    const newState = makeMove(state, move);
    const score = -minimax(newState, depth - 1, -beta, -alpha, -color, useQuiescence);
    
    best = Math.max(best, score);
    alpha = Math.max(alpha, score);
    if (alpha >= beta) break; // Pruning
  }
  
  return best;
}

/**
 * AI difficulty configurations
 */
const DIFFICULTY = {
  beginner:     { depth: 1, randomFactor: 50, useQuiescence: false },
  advanced:     { depth: 3, randomFactor: 10, useQuiescence: true },
  expert:       { depth: 5, randomFactor: 0,  useQuiescence: true }
};

/**
 * Find the best move for the current position
 */
function findBestMove(state, difficulty = 'advanced') {
  const config = DIFFICULTY[difficulty] || DIFFICULTY.advanced;
  const moves = generateLegalMoves(state);
  
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];
  
  const color = state.turn === WHITE ? 1 : -1;
  let bestMove = null;
  let bestScore = -Infinity;
  const scored = [];
  
  const sorted = orderMoves(moves, state);
  
  for (const move of sorted) {
    const newState = makeMove(state, move);
    const score = -minimax(newState, config.depth - 1, -Infinity, Infinity, -color, config.useQuiescence);
    
    // Add random factor for lower difficulties
    const randomized = score + (Math.random() - 0.5) * config.randomFactor;
    scored.push({ move, score: randomized });
    
    if (randomized > bestScore) {
      bestScore = randomized;
      bestMove = move;
    }
  }
  
  return bestMove;
}


// --- src/renderer/pieces.js ---
// ── SVG Chess Piece Definitions ────────────────────────────────
// High-quality Staunton-style chess pieces as SVG paths

const PIECE_SVGS = {
  // White pieces
  wk: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/>
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter"/>
      <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/>
      <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0"/>
    </g>
  </svg>`,
  
  wq: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
      <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" stroke-linecap="butt"/>
      <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/>
      <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/>
    </g>
  </svg>`,
  
  wr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/>
      <path d="M34 14l-3 3H14l-3-3"/>
      <path d="M15 17v7h15v-7" stroke-linecap="butt" stroke-linejoin="miter"/>
      <path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter"/>
      <path d="M14 29.5L11 36h23l-3-6.5H14z" stroke-linecap="butt" stroke-linejoin="miter"/>
    </g>
  </svg>`,
  
  wb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <g fill="#fff" stroke-linecap="butt">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
      </g>
      <path d="M17.5 26h10M15 30h15" stroke-linejoin="miter"/>
    </g>
  </svg>`,
  
  wn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/>
      <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/>
      <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#000"/>
      <path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/>
    </g>
  </svg>`,
  
  wp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  
  // Black pieces
  bk: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22.5 11.63V6" stroke-linejoin="miter"/>
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" stroke-linecap="butt" stroke-linejoin="miter"/>
      <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/>
      <path d="M20 8h5" stroke-linejoin="miter"/>
      <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/>
    </g>
  </svg>`,
  
  bq: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <g fill="#000" stroke="none">
        <circle cx="6" cy="12" r="2.75"/>
        <circle cx="14" cy="9" r="2.75"/>
        <circle cx="22.5" cy="8" r="2.75"/>
        <circle cx="31" cy="9" r="2.75"/>
        <circle cx="39" cy="12" r="2.75"/>
      </g>
      <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" fill="#000" stroke-linecap="butt"/>
      <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#000" stroke-linecap="butt"/>
      <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#fff"/>
    </g>
  </svg>`,
  
  br: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" stroke-linecap="butt" fill="#000"/>
      <path d="M14 29.5v-13h17v13H14z" stroke-linecap="butt" stroke-linejoin="miter" fill="#000"/>
      <path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" stroke-linecap="butt" fill="#000"/>
      <path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="miter"/>
    </g>
  </svg>`,
  
  bb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <g fill="#000" stroke-linecap="butt">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/>
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
        <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
      </g>
      <path d="M17.5 26h10M15 30h15" stroke="#fff" stroke-linejoin="miter"/>
    </g>
  </svg>`,
  
  bn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/>
      <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/>
      <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#fff" stroke="#fff"/>
      <path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/>
      <path d="M24.55 10.4l-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z" fill="#fff" stroke="none"/>
    </g>
  </svg>`,
  
  bp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
    <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`
};

// Cache for rendered piece images
const pieceImageCache = {};

/**
 * Get a piece image (creates and caches an Image element from SVG)
 */
function getPieceImage(color, type) {
  const key = color + type;
  if (pieceImageCache[key]) return pieceImageCache[key];
  
  const svgStr = PIECE_SVGS[key];
  if (!svgStr) return null;
  
  const img = new Image();
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  img.src = URL.createObjectURL(blob);
  pieceImageCache[key] = img;
  return img;
}

/**
 * Preload all piece images
 */
function preloadPieces() {
  const colors = ['w', 'b'];
  const types = ['k', 'q', 'r', 'b', 'n', 'p'];
  const promises = [];
  
  for (const c of colors) {
    for (const t of types) {
      const img = getPieceImage(c, t);
      if (img) {
        promises.push(new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        }));
      }
    }
  }
  
  return Promise.all(promises);
}


// --- src/renderer/boardRenderer.js ---
// ── HD Canvas Board Renderer ───────────────────────────────────




class BoardRenderer {
  constructor(canvas, themeManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.theme = themeManager;
    this.flipped = false;
    
    // Animation state
    this.animatingPiece = null; // { color, type, fromX, fromY, toX, toY, progress }
    this.particles = [];
    
    // Drag state
    this.dragging = null; // { color, type, x, y, fromRow, fromCol }
    
    // Board dimensions (set by resize)
    this.boardSize = 0;
    this.squareSize = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.resize();
  }
  
  resize() {
    const dpr = window.devicePixelRatio || 1;
    const container = this.canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);
    
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    this.ctx.scale(dpr, dpr);
    
    const padding = size * 0.04; // Space for labels
    this.boardSize = size - padding * 2;
    this.squareSize = this.boardSize / 8;
    this.offsetX = padding;
    this.offsetY = padding;
    this.displaySize = size;
  }
  
  /**
   * Convert pixel coordinates to board row/col
   */
  pixelToSquare(px, py) {
    const col = Math.floor((px - this.offsetX) / this.squareSize);
    const row = Math.floor((py - this.offsetY) / this.squareSize);
    
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    
    if (this.flipped) {
      return [7 - row, 7 - col];
    }
    return [row, col];
  }
  
  /**
   * Convert board row/col to pixel coordinates (top-left of square)
   */
  squareToPixel(row, col) {
    if (this.flipped) {
      return [
        this.offsetX + (7 - col) * this.squareSize,
        this.offsetY + (7 - row) * this.squareSize
      ];
    }
    return [
      this.offsetX + col * this.squareSize,
      this.offsetY + row * this.squareSize
    ];
  }
  
  /**
   * Main render function
   */
  render(state, options = {}) {
    const {
      selectedSquare = null,
      legalMoves = [],
      lastMove = null,
      inCheck = false,
      gameResult = null
    } = options;
    
    const ctx = this.ctx;
    const theme = this.theme.getTheme();
    const sq = this.squareSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.displaySize, this.displaySize);
    
    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.displaySize);
    bgGrad.addColorStop(0, theme.bgGradient[0]);
    bgGrad.addColorStop(1, theme.bgGradient[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.displaySize, this.displaySize);
    
    // Draw board border with subtle shadow effect
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = theme.border;
    ctx.fillRect(this.offsetX - 2, this.offsetY - 2, this.boardSize + 4, this.boardSize + 4);
    ctx.restore();
    
    // Draw squares
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const [px, py] = this.squareToPixel(r, c);
        const isLight = (r + c) % 2 === 0;
        
        // Base square color
        ctx.fillStyle = isLight ? theme.lightSquare : theme.darkSquare;
        ctx.fillRect(px, py, sq, sq);
        
        // Subtle gradient overlay for depth
        const sqGrad = ctx.createLinearGradient(px, py, px + sq, py + sq);
        sqGrad.addColorStop(0, 'rgba(255,255,255,0.05)');
        sqGrad.addColorStop(1, 'rgba(0,0,0,0.05)');
        ctx.fillStyle = sqGrad;
        ctx.fillRect(px, py, sq, sq);
        
        // Last move highlight
        if (lastMove) {
          if ((r === lastMove.from[0] && c === lastMove.from[1]) ||
              (r === lastMove.to[0] && c === lastMove.to[1])) {
            ctx.fillStyle = theme.lastMove;
            ctx.fillRect(px, py, sq, sq);
          }
        }
        
        // Selected square highlight
        if (selectedSquare && r === selectedSquare[0] && c === selectedSquare[1]) {
          ctx.fillStyle = theme.highlight;
          ctx.fillRect(px, py, sq, sq);
        }
        
        // Check highlight (king in check)
        if (inCheck) {
          const piece = state.board[r][c];
          if (piece && piece.type === 'k' && piece.color === state.turn) {
            // Radial red glow
            const cx = px + sq / 2, cy = py + sq / 2;
            const grad = ctx.createRadialGradient(cx, cy, sq * 0.1, cx, cy, sq * 0.6);
            grad.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
            grad.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(px, py, sq, sq);
          }
        }
      }
    }
    
    // Draw legal move indicators
    for (const move of legalMoves) {
      const [px, py] = this.squareToPixel(move.to[0], move.to[1]);
      const cx = px + sq / 2, cy = py + sq / 2;
      
      if (move.capture || move.enPassant) {
        // Capture: corner triangles
        ctx.strokeStyle = theme.legalCapture;
        ctx.lineWidth = sq * 0.08;
        ctx.beginPath();
        ctx.arc(cx, cy, sq * 0.45, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Move: centered dot
        ctx.fillStyle = theme.legalDot;
        ctx.beginPath();
        ctx.arc(cx, cy, sq * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw pieces
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = state.board[r][c];
        if (!piece) continue;
        
        // Skip if this piece is being dragged
        if (this.dragging && this.dragging.fromRow === r && this.dragging.fromCol === c) continue;
        
        // Skip if this piece is being animated
        if (this.animatingPiece && this.animatingPiece.fromRow === r && this.animatingPiece.fromCol === c) continue;
        
        const [px, py] = this.squareToPixel(r, c);
        this._drawPiece(piece.color, piece.type, px, py, sq);
      }
    }
    
    // Draw animating piece
    if (this.animatingPiece) {
      const a = this.animatingPiece;
      const [fromPx, fromPy] = this.squareToPixel(a.fromRow, a.fromCol);
      const [toPx, toPy] = this.squareToPixel(a.toRow, a.toCol);
      const t = this._easeInOutCubic(a.progress);
      const x = fromPx + (toPx - fromPx) * t;
      const y = fromPy + (toPy - fromPy) * t;
      this._drawPiece(a.color, a.type, x, y, sq);
    }
    
    // Draw dragging piece (on top of everything)
    if (this.dragging) {
      const d = this.dragging;
      this._drawPiece(d.color, d.type, d.x - sq / 2, d.y - sq / 2, sq * 1.1);
    }
    
    // Draw particles
    this._renderParticles(ctx);
    
    // Draw file and rank labels
    this._drawLabels(ctx, theme);
  }
  
  _drawPiece(color, type, x, y, size) {
    const img = getPieceImage(color, type);
    if (!img || !img.complete) return;
    
    const padding = size * 0.05;
    
    // Subtle piece shadow
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
    this.ctx.shadowBlur = size * 0.06;
    this.ctx.shadowOffsetX = size * 0.02;
    this.ctx.shadowOffsetY = size * 0.03;
    this.ctx.drawImage(img, x + padding, y + padding, size - padding * 2, size - padding * 2);
    this.ctx.restore();
  }
  
  _drawLabels(ctx, theme) {
    const sq = this.squareSize;
    const fontSize = sq * 0.22;
    ctx.font = `600 ${fontSize}px 'Inter', 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = theme.labelColor;
    
    for (let i = 0; i < 8; i++) {
      const file = this.flipped ? FILES[7 - i] : FILES[i];
      const rank = this.flipped ? RANKS[i] : RANKS[7 - i];
      
      // File labels (bottom)
      ctx.fillText(file, this.offsetX + i * sq + sq / 2, this.offsetY + this.boardSize + fontSize);
      
      // Rank labels (left)
      ctx.fillText(rank, this.offsetX - fontSize, this.offsetY + i * sq + sq / 2);
    }
  }
  
  /**
   * Animate a piece moving from one square to another
   */
  animateMove(fromRow, fromCol, toRow, toCol, color, type, onComplete) {
    this.animatingPiece = {
      fromRow, fromCol, toRow, toCol,
      color, type,
      progress: 0
    };
    
    const duration = 200; // ms
    const start = performance.now();
    
    const animate = (now) => {
      const elapsed = now - start;
      this.animatingPiece.progress = Math.min(elapsed / duration, 1);
      
      if (this.animatingPiece.progress >= 1) {
        this.animatingPiece = null;
        if (onComplete) onComplete();
        return;
      }
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Spawn capture particles
   */
  spawnCaptureParticles(row, col) {
    const [px, py] = this.squareToPixel(row, col);
    const cx = px + this.squareSize / 2;
    const cy = py + this.squareSize / 2;
    
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.5;
      const speed = 1.5 + Math.random() * 2;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        size: 2 + Math.random() * 3,
        color: `hsl(${40 + Math.random() * 30}, 90%, ${50 + Math.random() * 30}%)`
      });
    }
  }
  
  _renderParticles(ctx) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.vy += 0.05; // gravity
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  
  _easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Start dragging
  startDrag(row, col, color, type, x, y) {
    this.dragging = { fromRow: row, fromCol: col, color, type, x, y };
  }
  
  updateDrag(x, y) {
    if (this.dragging) {
      this.dragging.x = x;
      this.dragging.y = y;
    }
  }
  
  endDrag() {
    this.dragging = null;
  }
  
  flip() {
    this.flipped = !this.flipped;
  }
}


// --- src/themes/themeManager.js ---
// ── Theme Manager ──────────────────────────────────────────────

const THEMES = {
  classic: {
    name: 'Classic Wood',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    highlight: 'rgba(255, 255, 50, 0.45)',
    lastMove: 'rgba(155, 199, 0, 0.41)',
    legalDot: 'rgba(0, 0, 0, 0.15)',
    legalCapture: 'rgba(0, 0, 0, 0.15)',
    check: 'rgba(255, 0, 0, 0.6)',
    border: '#6b4226',
    labelColor: '#5a3d1e',
    bgGradient: ['#2c1810', '#1a0f09']
  },
  marble: {
    name: 'Dark Marble',
    lightSquare: '#c8c8d0',
    darkSquare: '#5a5a6e',
    highlight: 'rgba(120, 190, 255, 0.45)',
    lastMove: 'rgba(100, 160, 220, 0.35)',
    legalDot: 'rgba(255, 255, 255, 0.2)',
    legalCapture: 'rgba(255, 255, 255, 0.2)',
    check: 'rgba(255, 50, 50, 0.55)',
    border: '#3a3a4e',
    labelColor: '#888899',
    bgGradient: ['#1a1a2e', '#0f0f1a']
  },
  ocean: {
    name: 'Ocean Blue',
    lightSquare: '#d4e4f7',
    darkSquare: '#4a7fb5',
    highlight: 'rgba(255, 220, 100, 0.45)',
    lastMove: 'rgba(100, 220, 255, 0.35)',
    legalDot: 'rgba(0, 30, 60, 0.15)',
    legalCapture: 'rgba(0, 30, 60, 0.15)',
    check: 'rgba(255, 80, 80, 0.55)',
    border: '#2d5a87',
    labelColor: '#2d5a87',
    bgGradient: ['#0c2d48', '#061a2e']
  },
  forest: {
    name: 'Forest Green',
    lightSquare: '#eeedd5',
    darkSquare: '#769656',
    highlight: 'rgba(255, 255, 50, 0.45)',
    lastMove: 'rgba(155, 199, 0, 0.41)',
    legalDot: 'rgba(0, 0, 0, 0.15)',
    legalCapture: 'rgba(0, 0, 0, 0.15)',
    check: 'rgba(255, 0, 0, 0.5)',
    border: '#4a6b35',
    labelColor: '#4a6b35',
    bgGradient: ['#1a2e1a', '#0f1a0f']
  },
  cyber: {
    name: 'Neon Cyber',
    lightSquare: '#2a2a3a',
    darkSquare: '#1a1a28',
    highlight: 'rgba(0, 255, 200, 0.3)',
    lastMove: 'rgba(150, 0, 255, 0.3)',
    legalDot: 'rgba(0, 255, 200, 0.25)',
    legalCapture: 'rgba(0, 255, 200, 0.25)',
    check: 'rgba(255, 0, 80, 0.5)',
    border: '#00ffc8',
    labelColor: '#00ffc8',
    bgGradient: ['#0a0a14', '#050508']
  }
};

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('chess-theme') || 'classic';
    this.pieceSet = localStorage.getItem('chess-pieces') || 'classic';
    this.darkMode = localStorage.getItem('chess-darkmode') !== 'false';
  }
  
  getTheme() {
    return THEMES[this.currentTheme] || THEMES.classic;
  }
  
  setTheme(name) {
    if (THEMES[name]) {
      this.currentTheme = name;
      localStorage.setItem('chess-theme', name);
    }
  }
  
  setPieceSet(name) {
    this.pieceSet = name;
    localStorage.setItem('chess-pieces', name);
  }
  
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('chess-darkmode', this.darkMode);
    return this.darkMode;
  }
}


// --- src/audio/soundManager.js ---
// ── Sound Manager — Web Audio API ──────────────────────────────

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.5;
  }
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  
  _play(frequency, duration, type = 'sine', volume = null) {
    if (this.muted || !this.ctx) return;
    
    const vol = volume !== null ? volume : this.volume;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(vol * 0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }
  
  _playChord(frequencies, duration, type = 'sine') {
    for (const f of frequencies) {
      this._play(f, duration, type, this.volume * 0.2);
    }
  }
  
  move() {
    this._play(600, 0.08, 'sine');
    setTimeout(() => this._play(800, 0.06, 'sine'), 30);
  }
  
  capture() {
    this._play(300, 0.15, 'square');
    setTimeout(() => this._play(200, 0.1, 'square'), 50);
  }
  
  check() {
    this._play(900, 0.12, 'sawtooth');
    setTimeout(() => this._play(1100, 0.1, 'sawtooth'), 80);
  }
  
  castle() {
    this._play(500, 0.1, 'sine');
    setTimeout(() => this._play(600, 0.1, 'sine'), 60);
    setTimeout(() => this._play(700, 0.08, 'sine'), 120);
  }
  
  gameOver() {
    this._playChord([262, 330, 392], 0.5, 'sine');
    setTimeout(() => this._playChord([349, 440, 523], 0.8, 'sine'), 400);
  }
  
  illegal() {
    this._play(150, 0.15, 'square');
  }
  
  promote() {
    this._play(523, 0.1, 'sine');
    setTimeout(() => this._play(659, 0.1, 'sine'), 80);
    setTimeout(() => this._play(784, 0.15, 'sine'), 160);
  }
  
  tick() {
    this._play(1200, 0.02, 'sine', 0.1);
  }
  
  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
  
  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
  }
}


// --- src/main.js ---
// ── Fatima Chess Board — Main Application ──────────────────────








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
}

// ── Board Event Handlers ──────────────────────────────────────
function setupBoardEvents(canvas) {
  let isDragging = false;
  let dragStartSquare = null;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function handleStart(e) {
    e.preventDefault();
    if (isDragging) return;
    const pos = getPos(e);
    const sq = app.renderer.pixelToSquare(pos.x, pos.y);
    if (!sq) return;
    
    const [row, col] = sq;
    const piece = app.game.getState().board[row][col];
    
    if (app.mode === 'bot' && app.game.getTurn() !== app.playerColor) return;
    
    if (piece && piece.color === app.game.getTurn()) {
      isDragging = true;
      dragStartSquare = [row, col];
      app.renderer.startDrag(row, col, piece.color, piece.type, pos.x, pos.y);
      app.game.selectSquare(row, col);
      renderBoard();
    } else {
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
    if (!isDragging) return;
    
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


