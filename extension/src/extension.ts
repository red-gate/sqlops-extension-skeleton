'use strict';

import * as vscode from 'vscode';

import { scheme, createUri } from './extensionUri';

import ExtensionContentProvider from './extensionContentProvider';
import { ExtensionProxy } from './proxy/extensionProxy';
import ExtensionContext from './ExtensionContext';

export function activate(context: vscode.ExtensionContext) {
    const extensionContext = new ExtensionContext(context);
    const extensionProxy = new ExtensionProxy(extensionContext);
    const extensionContentProvider = new ExtensionContentProvider(extensionProxy);

    context.subscriptions.push(
        vscode.commands.registerCommand('myextension.sendMessage', () => sendMessage(extensionContentProvider)),
        vscode.workspace.registerTextDocumentContentProvider(scheme, extensionContentProvider)
    );
}

export function deactivate() {
}

async function sendMessage(extensionContentProvider: vscode.TextDocumentContentProvider): Promise<{}> | undefined {
    let message = await promptForMessage();

    if (!message) {
        return vscode.window.showWarningMessage('Please provide valid message');
    }

    let uri = createUri('myextension', { message });
    const panel = vscode.window.createWebviewPanel('extension.helloPanel', `Show message: ${message}`, vscode.ViewColumn.One);
    panel.webview.html = await extensionContentProvider.provideTextDocumentContent(uri, null);
    return
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