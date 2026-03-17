// ── Chess Board Representation ─────────────────────────────────
import { WHITE, BLACK, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, FILES, RANKS, INITIAL_FEN } from './constants.js';

/**
 * Piece object: { type: 'p'|'n'|'b'|'r'|'q'|'k', color: 'w'|'b' }
 * Board is 8x8 array: board[row][col], row 0 = rank 8, row 7 = rank 1
 */

export function createPiece(type, color) {
  return { type, color };
}

export function createBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

export function cloneBoard(board) {
  return board.map(row => row.map(sq => sq ? { ...sq } : null));
}

export function rowColToAlgebraic(row, col) {
  return FILES[col] + RANKS[7 - row];
}

export function algebraicToRowCol(sq) {
  const col = FILES.indexOf(sq[0]);
  const row = 7 - RANKS.indexOf(sq[1]);
  return [row, col];
}

export function isInBounds(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Parse a FEN string into a game state object
 */
export function parseFEN(fen) {
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
export function toFEN(state) {
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
export function findKing(board, color) {
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
export function getPieces(board, color) {
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
