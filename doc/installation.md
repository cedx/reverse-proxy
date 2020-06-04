# Installation

## Requirements
Before installing **Reverse-Proxy.js**, you need to make sure you have [Node.js](https://nodejs.org)
and [npm](https://www.npmjs.com), the Node.js package manager, up and running.
		
You can verify if you're already good to go with the following commands:

``` shell
node --version
# v14.3.0

npm --version
# 6.14.5
```

!!! info
	If you plan to play with the package sources, you will also need
	[PowerShell](https://docs.microsoft.com/en-us/powershell) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material).

## Installing with npm package manager
From a command prompt, run:

``` shell
npm install --global @cedx/reverse-proxy
```

!!! tip
	Consider adding the [`npm install --global`](https://docs.npmjs.com/files/folders) executables directory to your system path.

Now you should be able to use the `reverse_proxy` executable:

``` shell
reverse_proxy --version
# 10.0.0
```
