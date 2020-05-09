#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)
node_modules/.bin/eslint.ps1 --config=etc/eslint.yaml --fix src/**/*.ts
