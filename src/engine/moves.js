// ── Move Generation & Validation ───────────────────────────────
import { WHITE, BLACK, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING,
         ROOK_DIRS, BISHOP_DIRS, QUEEN_DIRS, KNIGHT_OFFSETS, KING_OFFSETS } from './constants.js';
import { isInBounds, cloneBoard, findKing, rowColToAlgebraic, algebraicToRowCol } from './board.js';

/**
 * Check if a square is attacked by the given color
 */
export function isSquareAttacked(board, row, col, byColor) {
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
export function isInCheck(board, color) {
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
export function makeMove(state, move) {
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
export function generateLegalMoves(state) {
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
export function getLegalMovesForSquare(state, row, col) {
  return generateLegalMoves(state).filter(
    m => m.from[0] === row && m.from[1] === col
  );
}

/**
 * Convert a move to algebraic notation (SAN)
 */
export function moveToSAN(state, move) {
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
export function getGameResult(state, positionHistory) {
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
