$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\UserA\drivetime\server"
& "C:\Program Files\nodejs\npm.cmd" install 2>&1
