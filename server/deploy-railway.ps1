$machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$env:PATH = "$machinePath;$userPath"
Set-Location "C:\Users\UserA\drivetime\server"

# Create new Railway project and deploy
railway init --name drivetime-server 2>&1
railway up 2>&1
