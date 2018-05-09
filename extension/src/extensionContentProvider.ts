'use strict';

import * as vscode from 'vscode';
import BaseUri from './proxy/baseUri';
import { ExtensionProxy } from './proxy/ExtensionProxy';

export default class ExtensionContentProvider implements vscode.TextDocumentContentProvider {
    onDidChange?: vscode.Event<vscode.Uri>;
    private proxyAddress: BaseUri;

    constructor(proxy: ExtensionProxy) {
        this.proxyAddress = proxy.start();
    }

    async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        const url = uri.with(this.proxyAddress).toString(true);

        console.log('serving at: ', url);

        const timeNow = new Date().getTime();
        return `<html>
            <head>
                <script type="text/javascript">
                    window.onload = function() {
                        console.log('reloaded extension window at time ${timeNow}ms');
                        var encode = function (s) {
                            return encodeURIComponent(s.trim());
                        };
                        var styles = window.getComputedStyle(document.documentElement);
                        var backgroundColor = styles.getPropertyValue('--background-color');
                        var color = styles.getPropertyValue('--color');
                        var fontFamily = styles.getPropertyValue('--font-family');
                        var fontSize = styles.getPropertyValue('--font-size');
                        var url = "${url}" +
                            "&fontFamily=" + encode(fontFamily) +
                            "&fontSize=" + encode(fontSize) +
                            "&backgroundColor=" + encode(backgroundColor) +
                            "&color=" + encode(color);
                        document.getElementById('frame').src = url;
                    };
                </script>
            </head>
            <body style="margin: 0; padding: 0; height: 100%; overflow: hidden;">
                <iframe id="frame" width="100%" height="100%" frameborder="0" style="position:absolute; left: 0; right: 0; bottom: 0; top: 0px;"/>
            </body>
        </html>`;
    }
}
