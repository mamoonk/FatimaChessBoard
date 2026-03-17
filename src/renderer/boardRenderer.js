// ── HD Canvas Board Renderer ───────────────────────────────────
import { FILES, RANKS, WHITE, BLACK } from '../engine/constants.js';
import { rowColToAlgebraic } from '../engine/board.js';
import { getPieceImage } from './pieces.js';

export class BoardRenderer {
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
