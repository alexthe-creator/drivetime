$machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$env:PATH = "$machinePath;$userPath"

Write-Host "--- Node ---"
node --version 2>&1

Write-Host "--- Railway ---"
railway --version 2>&1

Write-Host "--- Railway login status ---"
railway whoami 2>&1
