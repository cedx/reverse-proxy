#!/usr/bin/env pwsh
$basedir = Split-Path $MyInvocation.MyCommand.Definition -Parent
& node "$basedir/reverse_proxy.js" $args
