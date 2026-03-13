$machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$env:PATH = "$machinePath;$userPath"
Set-Location "C:\Users\UserA\drivetime"

railway init --name drivetime-app 2>&1
railway variables set REACT_APP_NEWSLETTER_API_URL="https://drivetime-server-production.up.railway.app/api/newsletters" 2>&1
railway up 2>&1
