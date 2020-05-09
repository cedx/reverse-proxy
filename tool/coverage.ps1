#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)
node_modules/.bin/coveralls.ps1 var/lcov.info
