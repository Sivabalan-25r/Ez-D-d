# Ez D&d - Local System Boot Sequence
Write-Host "Initializing Ez D&d Engines..." -ForegroundColor Cyan

# 1. Kill any stale hanging node processes that might hold the ports
Write-Host "Clearing stale ports..." -ForegroundColor Gray
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue 

# 2. Boot Intelligence Backend
Write-Host "Booting AI Oracle (Port 5000)..." -ForegroundColor Magenta
$null = Start-Job -ScriptBlock {
    Set-Location "c:\Proj\Ez D&d\backend"
    node server.js
}

# 3. Boot Local Static Server (Frontend)
Write-Host "Booting Graphical User Interface (Port 5500)..." -ForegroundColor Green
$null = Start-Job -ScriptBlock {
    Set-Location "c:\Proj\Ez D&d"
    node node_modules/http-server/bin/http-server . -p 5500 -c-1
}

# 4. Wait for spin-up before launching browser
Start-Sleep -Seconds 3
Write-Host "All systems nominal. Engaging interface..." -ForegroundColor Cyan
Start-Process "http://localhost:5500/builder.html"
