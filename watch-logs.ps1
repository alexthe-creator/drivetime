$machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$env:PATH = "$machinePath;$userPath"
Set-Location "C:\Users\UserA\drivetime"
railway service "drivetime-app" 2>&1
Start-Sleep -Seconds 60
railway logs 2>&1 | Select-Object -Last 40
