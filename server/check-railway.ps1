$machinePath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
$env:PATH = "$machinePath;$userPath"
Set-Location "C:\Users\UserA\drivetime\server"

Write-Host "=== Variables ==="
railway variables --service 67ee7cb2-cb94-44c1-b345-2d8ec6633c57 2>&1

Write-Host "=== Domain ==="
railway domain --service 67ee7cb2-cb94-44c1-b345-2d8ec6633c57 2>&1
