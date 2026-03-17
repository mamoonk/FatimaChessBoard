// ── Chess AI — Minimax with Alpha-Beta Pruning ─────────────────
import { WHITE, BLACK, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, PIECE_VALUES, PST } from './constants.js';
import { getPieces } from './board.js';
import { generateLegalMoves, makeMove, isInCheck } from './moves.js';

/**
 * Evaluate a position from white's perspective
 */
export function evaluate(state) {
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
export function findBestMove(state, difficulty = 'advanced') {
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
