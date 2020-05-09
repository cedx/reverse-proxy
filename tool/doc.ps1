#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)

node_modules/.bin/typedoc.ps1 --options etc/typedoc.json
Copy-Item doc/img/favicon.ico doc/api
mkdocs build --config-file=etc/mkdocs.yaml
