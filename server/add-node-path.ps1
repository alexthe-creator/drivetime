# Add Node.js to system PATH so cmd.exe and npm scripts can find it
$nodePath = "C:\Program Files\nodejs"
$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
if ($currentPath -notlike "*$nodePath*") {
    [System.Environment]::SetEnvironmentVariable("PATH", "$nodePath;$currentPath", "Machine")
    Write-Host "Added Node.js to system PATH."
} else {
    Write-Host "Node.js already in system PATH."
}

# Also add npm global bin
$npmGlobal = "$env:APPDATA\npm"
$userPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*$npmGlobal*") {
    [System.Environment]::SetEnvironmentVariable("PATH", "$npmGlobal;$userPath", "User")
    Write-Host "Added npm global bin to user PATH."
} else {
    Write-Host "npm global bin already in user PATH."
}

Write-Host "Done. Please restart your terminal for PATH changes to take effect."
