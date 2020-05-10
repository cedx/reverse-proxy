#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

$version = (Get-Content package.json | ConvertFrom-Json).version
$lines = @(
  '/** The version number of the package. */',
  "export const packageVersion = '$version';"
)

Set-Content src/cli/version.g.ts ($lines -join [Environment]::NewLine)
