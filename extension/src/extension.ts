'use strict';

import * as vscode from 'vscode';

import { scheme, createUri } from './extensionUri';

import ExtensionContentProvider from './extensionContentProvider';
import { ExtensionProxy } from './proxy/extensionProxy';
import ExtensionContext from './ExtensionContext';

export function activate(context: vscode.ExtensionContext) {
    const extensionContext = new ExtensionContext(context);
    const extensionProxy = new ExtensionProxy(extensionContext);

    context.subscriptions.push(
        vscode.commands.registerCommand('myextension.sendMessage', () => sendMessage()),
        vscode.workspace.registerTextDocumentContentProvider(scheme, new ExtensionContentProvider(extensionProxy))
    );
}

export function deactivate() {
}

async function sendMessage(): Promise<{}> | undefined {
    let message = await promptForMessage();

    if (!message) {
        return vscode.window.showWarningMessage('Please provide valid message');
    }

    let uri = createUri('myextension', { message });
    return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.One, `Show message: ${message}`);
}

async function promptForMessage(): Promise<string | undefined> {
    let userMessage = await getMessage();

    if (!userMessage) {
        return undefined;
    }

    return userMessage;
}

function getMessage(): Thenable<string> {
    let options = {
        placeHolder: 'Your message here',
        prompt: 'MyExtension'
    };
    return vscode.window.showInputBox(options);
}