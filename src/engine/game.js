// ── Game State Controller ──────────────────────────────────────
import { parseFEN, toFEN, rowColToAlgebraic, cloneBoard } from './board.js';
import { generateLegalMoves, getLegalMovesForSquare, makeMove, moveToSAN, getGameResult, isInCheck } from './moves.js';
import { INITIAL_FEN, WHITE, BLACK } from './constants.js';

export class GameController {
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
