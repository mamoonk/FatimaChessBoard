// ── Theme Manager ──────────────────────────────────────────────

export const THEMES = {
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

export class ThemeManager {
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
