#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
Set-Location (Split-Path $PSScriptRoot)
node bin/reverse_proxy.js --address=127.0.0.1 --target=8080
