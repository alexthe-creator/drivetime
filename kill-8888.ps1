$connections = Get-NetTCPConnection -LocalPort 8888 -ErrorAction SilentlyContinue
if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($p in $pids) {
        Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        Write-Host "Killed PID $p"
    }
} else {
    Write-Host "No process on 8888"
}
