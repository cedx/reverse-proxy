#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

tool/version.ps1
node_modules/.bin/tsc.ps1 --project src/tsconfig.json
