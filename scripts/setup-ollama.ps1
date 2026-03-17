<#
Setup script for Ollama (Windows). This script will:
- Install Ollama via winget (if available)
- Verify `ollama --version`
- Install the Ollama VS Code extension (if `code` CLI is available)
- Write workspace `.vscode/settings.json` with recommended Ollama settings
- Optionally pull a model when `-PullModel` is passed

Run from the project root in PowerShell with:
  powershell -ExecutionPolicy Bypass -File .\scripts\setup-ollama.ps1 -PullModel
#>

param(
  [switch]$PullModel
)

function Write-Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Write-Warn($m) { Write-Host "[WARN] $m" -ForegroundColor Yellow }
function Write-Err($m) { Write-Host "[ERROR] $m" -ForegroundColor Red }

Write-Info "Checking for Ollama on PATH..."
if (Get-Command ollama -ErrorAction SilentlyContinue) {
  Write-Info "Ollama already installed: $(ollama --version)"
} else {
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Info "Installing Ollama with winget..."
    try {
      winget install --id Ollama.Ollama -e --accept-package-agreements --accept-source-agreements
    } catch {
      Write-Warn "winget install failed: $_"
      Write-Warn "Please install Ollama manually from https://ollama.com/install"
      exit 1
    }
  } else {
    Write-Warn "winget not available. Please install Ollama manually from https://ollama.com/install"
    exit 1
  }
}

# Verify Ollama
try {
  $ver = & ollama --version 2>$null
  if ($LASTEXITCODE -ne 0) { throw "no response" }
  Write-Info "Ollama is available: $ver"
} catch {
  Write-Err "Failed to run 'ollama' after install. Ensure the binary is on PATH and retry."
  exit 1
}

# Install VS Code extension if CLI is available
if (Get-Command code -ErrorAction SilentlyContinue) {
  Write-Info "Installing Ollama VS Code extension (if not already installed)..."
  try {
    code --install-extension ollama.ollama --force
    Write-Info "VS Code extension command executed. If VS Code was not running, relaunch it."
  } catch {
    Write-Warn "Failed to install VS Code extension via 'code' CLI: $_"
  }
} else {
  Write-Warn "VS Code CLI 'code' not found. You can install the extension from the Extensions view in VS Code (search 'Ollama')."
}

# Write recommended workspace settings
$vscodeDir = Join-Path (Get-Location) '.vscode'
if (!(Test-Path $vscodeDir)) { New-Item -ItemType Directory -Path $vscodeDir | Out-Null }
$settingsPath = Join-Path $vscodeDir 'settings.json'

$settings = @{
  'ollama.host' = 'http://localhost:11434'
  'ollama.model' = 'llama2'
}

try {
  $json = $settings | ConvertTo-Json -Depth 4
  Set-Content -Path $settingsPath -Value $json -Encoding UTF8
  Write-Info "Wrote workspace settings to $settingsPath"
} catch {
  Write-Warn "Could not write workspace settings: $_"
}

if ($PullModel) {
  Write-Info "Pulling 'llama2' model (this may take time and disk space)..."
  try {
    & ollama pull llama2
  } catch {
    Write-Warn "Failed to pull model: $_"
  }
}

Write-Info "Setup complete. Use 'ollama list' to see available models and 'ollama run <model>' to run one."
Write-Info "Open VS Code and use the Ollama extension (or the CLI) to interact with local models."
