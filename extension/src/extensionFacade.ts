'use strict';

import * as child_process from 'child_process';
import ExtensionContext from './extensionContext';
import VersionResult from './versionResult';

export default class BackendFacade {
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    async version(): Promise<VersionResult> {
        let output = await this.runCli('version');
        let response = JSON.parse(output);
        return { version: response.version } as VersionResult;
    }

    private runCli(command: string, commandArgs: string[] = []): Promise<string> {
        const backendDll = 'backend/Backend.Console.dll';
        const dotnetArgs = [backendDll, command].concat(commandArgs);

        // TODO: Don't rely on dotnet being installed
        const dotnet = child_process.spawn('dotnet', dotnetArgs, { cwd: this.context.extensionPath, env: process.env });
        return this.getOutputFrom(dotnet);
    }

    private getOutputFrom(process: child_process.ChildProcess): Promise<string> {
        return new Promise((resolve, reject) => {
            let output = '';
            let error = '';

            process.stdout.on('close', () => {
                resolve(output);
            });
            process.stdout.on('data', x => {
                output += x;
            });
            process.stderr.on('data', x => {
                error += x;
            });
            process.stderr.on('close', () => {
                if (!!error) {
                    reject(error);
                }
            })
        });
    }
}