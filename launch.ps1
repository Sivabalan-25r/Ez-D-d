# Safe Launch Script for Ez D&d
$root = Get-Location
$backendDir = Join-Path $root 'backend'

Write-Host "Starting Ez D&d..."

# Start Backend
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    node server.js
} -ArgumentList $backendDir

# Start Frontend
npx live-server . --port=3000 --open=index.html

# Cleanup
Stop-Job $backendJob
Write-Host "Done."
