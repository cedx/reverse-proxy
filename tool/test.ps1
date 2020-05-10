#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

tool/build.ps1
node_modules/.bin/c8 --all --include=lib/**/*.js --report-dir=var --reporter=lcovonly node_modules/.bin/mocha --recursive
