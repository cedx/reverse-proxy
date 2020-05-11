#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)
[Console]::TreatControlCAsInput = $true

$action = {
  if ($EventArgs.Name -notlike '*.g.ts') {
    $changeType = [String] $EventArgs.ChangeType
    Write-Host "'$($EventArgs.Name)' was $($changeType.ToLower()): starting a new build..."
    $timeSpan = Measure-Command { tool/build.ps1 }
    Write-Host "> Finished the build after $($timeSpan.TotalSeconds) seconds."
  }
}

$watcher = New-Object System.IO.FileSystemWatcher (Resolve-Path src).Path
$watcher.EnableRaisingEvents = $true
$watcher.IncludeSubdirectories = $true

foreach ($event in 'Changed', 'Created', 'Deleted', 'Renamed') {
  Register-ObjectEvent $watcher $event -Action $action | Out-Null
}

$console = $Host.UI.RawUI;
while ($true) {
  if ($console.KeyAvailable -and ($console.ReadKey('AllowCtrlC,IncludeKeyUp,NoEcho').Character -eq 3)) { break }
  Start-Sleep -Milliseconds 200
}

Get-EventSubscriber | Unregister-Event
