$machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$env:PATH = "$machinePath;$userPath"
Set-Location "C:\Users\UserA\drivetime"

railway variables set REACT_APP_NEWSLETTER_API_URL="https://drivetime-server-production.up.railway.app/api/newsletters" --service 9d3f0bda-2bb0-4b5b-b8ef-3969c2d06b47 2>&1
railway domain --service 9d3f0bda-2bb0-4b5b-b8ef-3969c2d06b47 2>&1
