# Installation

## Requirements
Before installing **Reverse Proxy**, you need to make sure you have [Node.js](https://nodejs.org) up and running.

!!! warning
    Reverse Proxy requires Node.js >= **10.14.0**.
    
You can verify if you're already good to go with the following commands:

```shell
node --version
# v11.3.0
```

!!! info
    If you plan to play with the package sources, you will also need
    [Grinder](https://google.github.io/grinder.dart) and
    [Material for MkDocs](https://squidfunk.github.io/mkdocs-material).

## Installing with npm package manager
From a command prompt, run [npm](https://www.npmjs.com):

```shell
npm install --global @cedx/reverse-proxy
```

!!! tip
    Consider adding the [`npm install --global`](https://docs.npmjs.com/files/folders) executables directory to your system path.

Now you should be able to use the `reverse_proxy` executable:

```shell
reverse_proxy --version
# 1.0.0
```

## Installing with Pub package manager
From a command prompt, run [Pub](https://www.dartlang.org/tools/pub):

```shell
pub global activate reverse_proxy
```

!!! tip
    Consider adding the [`pub global`](https://www.dartlang.org/tools/pub/cmd/pub-global) executables directory to your system path.
