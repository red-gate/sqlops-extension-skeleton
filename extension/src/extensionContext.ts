'use strict';

import * as vscode from 'vscode';
import * as path from 'path';

export default class ExtensionContext {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    get extensionPath(): string {
        return path.join(this.context.extensionPath, 'out');;
    }
}