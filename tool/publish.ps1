#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

tool/clean.ps1
npm publish

$version = (Get-Content package.json | ConvertFrom-Json).version
git tag "v$version"
git push origin "v$version"
