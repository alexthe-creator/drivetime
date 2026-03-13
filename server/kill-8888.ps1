$connections = Get-NetTCPConnection -LocalPort 8888 -ErrorAction SilentlyContinue
foreach ($conn in $connections) {
    Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
}
Write-Host "Port 8888 cleared"
