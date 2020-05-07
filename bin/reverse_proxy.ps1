#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
node "$PSScriptRoot/reverse_proxy.js" $args
