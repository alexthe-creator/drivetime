# Read fresh PATH from registry so node is available to child processes
$machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$env:PATH = "$machinePath;$userPath"

Write-Host "node version: $(& node --version)"
Write-Host "Installing Railway CLI..."
& npm install -g @railway/cli
