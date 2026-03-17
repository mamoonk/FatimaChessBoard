$files = @(
    "src/engine/constants.js",
    "src/engine/board.js",
    "src/engine/moves.js",
    "src/engine/game.js",
    "src/ai/engine.js",
    "src/renderer/pieces.js",
    "src/renderer/boardRenderer.js",
    "src/themes/themeManager.js",
    "src/audio/soundManager.js",
    "src/main.js"
)

$outPath = "bundle.js"
$allContent = ""

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw
        # Remove import statements (handles multi-line)
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?s)import\s+.*?from\s+[''"].*?[''"];?', '')
        
        # Remove export statements
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?m)^export\s+(function|const|class)\s+', '$1 ')
        
        $allContent += "`n// --- $f ---`n" + $content + "`n"
    } else {
        Write-Host "Missing file: $f"
    }
}

Set-Content $outPath -Value $allContent
Write-Host "Bundle created!"
