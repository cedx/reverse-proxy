#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

tool/version.ps1
node_modules/.bin/tsc --project src/tsconfig.json
