# SQLOps extension skeleton

A SQL Operations Studio extension skeleton based on SQL Search extension

## Prerequisites

* NodeJS
* [.NET Core](https://www.microsoft.com/net/download)

## How to run in SQL Ops Studio

1. `npm install`
1. `npm run package`
    * The `.vsix` will be saved to `artifacts/`
1. In SQL Ops Studio, navigate to _File > Install Extension from VSIX Package_ and select the `.vsix` generated in the previous step
1. Reload sqlops

## Using the extension

The extension exposes its functionality through commands. Open the command palette (`Ctrl`/`Cmd` + `Shift` + `p`) and type "MyExtension" to get started.

![demo sql ops extension skeleton](./images/sql-ops-extension-skeleton.gif)

## Build

### Build and debug extension

* open `vscode` at the root directory
* hit `F5`

### Build and run backend in standalone

```bash
➜ cd backend
➜ dotnet build
➜ dotnet src/Backend.Console/bin/Debug/netcoreapp2.0/Backend.Console.dll version
{"version": "0.2.0"}
```

### Build and run frontend in standalone

```bash
➜ cd frontend
➜ yarn
➜ yarn start
```

**Note**: As the frontend needs the extension for API and query parameters it won't completely work standalone.