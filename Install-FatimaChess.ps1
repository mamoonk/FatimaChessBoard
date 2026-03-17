Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

$form = New-Object System.Windows.Forms.Form
$form.Text = "Fatima Chess Installer"
$form.Size = New-Object System.Drawing.Size(600, 560)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false

# Show Packager Graphic
$pictureBox = New-Object System.Windows.Forms.PictureBox
$pictureBox.Size = New-Object System.Drawing.Size(600, 337)
$pictureBox.Location = New-Object System.Drawing.Point(0, 0)
$pictureBox.SizeMode = "Zoom"
$pictureBox.BackColor = [System.Drawing.Color]::Black
if (Test-Path "$PSScriptRoot\assets\banner.png") {
    $pictureBox.Image = [System.Drawing.Image]::FromFile("$PSScriptRoot\assets\banner.png")
}
$form.Controls.Add($pictureBox)

$label = New-Object System.Windows.Forms.Label
$label.Text = "Welcome to the Fatima Chess Setup Wizard.`n`nThis will install Fatima Chess on your computer."
$label.Location = New-Object System.Drawing.Point(20, 350)
$label.Size = New-Object System.Drawing.Size(560, 60)
$label.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$form.Controls.Add($label)

$installBtn = New-Object System.Windows.Forms.Button
$installBtn.Text = "Install"
$installBtn.Location = New-Object System.Drawing.Point(400, 480)
$installBtn.Size = New-Object System.Drawing.Size(80, 30)
$form.Controls.Add($installBtn)

$cancelBtn = New-Object System.Windows.Forms.Button
$cancelBtn.Text = "Cancel"
$cancelBtn.Location = New-Object System.Drawing.Point(490, 480)
$cancelBtn.Size = New-Object System.Drawing.Size(80, 30)
$form.Controls.Add($cancelBtn)

$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Location = New-Object System.Drawing.Point(20, 430)
$progressBar.Size = New-Object System.Drawing.Size(550, 20)
$progressBar.Visible = $false
$form.Controls.Add($progressBar)

$installBtn.Add_Click({
    $installBtn.Enabled = $false
    $cancelBtn.Enabled = $false
    $progressBar.Visible = $true
    $progressBar.Style = "Marquee"
    $label.Text = "Installing Fatima Chess..."
    $form.Refresh()

    try {
        $dest = "$env:LOCALAPPDATA\FatimaChess"
        if (!(Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }
        
        Copy-Item "$PSScriptRoot\index.html" "$dest\index.html" -Force
        Copy-Item "$PSScriptRoot\bundle.js" "$dest\bundle.js" -Force
        Copy-Item "$PSScriptRoot\src" "$dest\src" -Recurse -Force
        Copy-Item "$PSScriptRoot\assets" "$dest\assets" -Recurse -Force
        # Also copy optional helper scripts and resources
        if (Test-Path "$PSScriptRoot\styles") { Copy-Item "$PSScriptRoot\styles" "$dest\styles" -Recurse -Force }
        if (Test-Path "$PSScriptRoot\themes") { Copy-Item "$PSScriptRoot\themes" "$dest\themes" -Recurse -Force }
        if (Test-Path "$PSScriptRoot\build.ps1") { Copy-Item "$PSScriptRoot\build.ps1" "$dest\build.ps1" -Force }

        $WshShell = New-Object -comObject WScript.Shell
        $Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Fatima Chess.lnk")
        $Shortcut.TargetPath = "$dest\index.html"
        if (Test-Path "$dest\assets\icon.ico") {
            $Shortcut.IconLocation = "$dest\assets\icon.ico,0"
        }
        $Shortcut.WorkingDirectory = $dest
        $Shortcut.Save()

        # Fallback: also create an Internet Shortcut (.url) which reliably supports custom icons
        try {
            $desktopUrl = Join-Path $env:USERPROFILE 'Desktop\Fatima Chess.url'
            $fileUrl = 'file:///' + ($dest -replace '\\','/') + '/index.html'
            $iconPath = Join-Path $dest 'assets\icon.ico'
            $urlContent = "[InternetShortcut]`nURL=$fileUrl`nIconFile=$iconPath`nIconIndex=0"
            Set-Content -Path $desktopUrl -Value $urlContent -Encoding ASCII
        } catch {
            Write-Verbose "Failed to create .url shortcut on Desktop: $_"
        }
        
        # Create Start Menu shortcut
        $startMenuFolder = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Fatima Chess"
        if (!(Test-Path $startMenuFolder)) { New-Item -ItemType Directory -Force -Path $startMenuFolder | Out-Null }
        $startShortcut = $WshShell.CreateShortcut("$startMenuFolder\Fatima Chess.lnk")
        $startShortcut.TargetPath = "$dest\index.html"
        if (Test-Path "$dest\assets\icon.ico") { $startShortcut.IconLocation = "$dest\assets\icon.ico,0" }
        $startShortcut.WorkingDirectory = $dest
        $startShortcut.Save()

        # Fallback Start Menu .url shortcut
        try {
            $startUrl = Join-Path $startMenuFolder 'Fatima Chess.url'
            $fileUrl = 'file:///' + ($dest -replace '\\','/') + '/index.html'
            $iconPath = Join-Path $dest 'assets\icon.ico'
            $urlContent = "[InternetShortcut]`nURL=$fileUrl`nIconFile=$iconPath`nIconIndex=0"
            Set-Content -Path $startUrl -Value $urlContent -Encoding ASCII
        } catch {
            Write-Verbose "Failed to create .url shortcut in Start Menu: $_"
        }
        
        $progressBar.Style = "Blocks"
        $progressBar.Value = 100
        $label.Text = "Installation Complete."
        $form.Refresh()

        # Create a simple uninstall script
        $uninstallScript = @"
Add-Type -AssemblyName System.Windows.Forms
if ([System.Windows.Forms.MessageBox]::Show('Uninstall Fatima Chess?','Uninstall', 'YesNo','Question') -ne 'Yes') { exit }
try {
    Remove-Item -Recurse -Force "$dest"
    Remove-Item "$env:USERPROFILE\Desktop\Fatima Chess.lnk" -ErrorAction SilentlyContinue
    Remove-Item "$startMenuFolder\Fatima Chess.lnk" -ErrorAction SilentlyContinue
    Remove-Item "$startMenuFolder" -Recurse -Force -ErrorAction SilentlyContinue
    [System.Windows.Forms.MessageBox]::Show('Fatima Chess was uninstalled successfully.','Uninstall Complete',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Information)
} catch {
    [System.Windows.Forms.MessageBox]::Show("Failed to uninstall: $_","Error",[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Error)
}
"@
        $uninstallPath = Join-Path $dest 'uninstall-FatimaChess.ps1'
        Set-Content -Path $uninstallPath -Value $uninstallScript -Encoding UTF8

        [System.Windows.Forms.MessageBox]::Show("Fatima Chess has been installed successfully! Shortcuts were placed on your Desktop and Start Menu.", "Installation Complete", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
        $form.Close()
    } catch {
        [System.Windows.Forms.MessageBox]::Show("An error occurred: $_", "Error", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
        $form.Close()
    }
})

$cancelBtn.Add_Click({
    $form.Close()
})

$form.ShowDialog() | Out-Null
