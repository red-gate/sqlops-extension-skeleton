'use strict';

import * as vscode from 'vscode';
import * as querystring from 'querystring';

export const scheme = 'rg';
const baseUri = vscode.Uri.parse(`${scheme}://my-extension`);

export function createUri(path: string, payload: any): vscode.Uri {
    return baseUri.with({
        path: `/${path}`,
        query: querystring.stringify(payload)
    });
}