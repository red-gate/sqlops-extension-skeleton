'use strict';

import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import BaseUri from './baseUri';
import ExtensionContext from '../extensionContext';

export default class LocalWebServer {
    private app = express();
    private server;
    private serverPort: string;
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
        this.app.use(express.urlencoded());
        this.app.use(express.json());
        this.server = http.createServer(this.app);
    }

    get baseUri(): BaseUri {
        return {
            scheme: 'http',
            authority: `localhost:${this.serverPort}`
        };
    }

    addGetHandler(url: string, handler: (request, response) => void) {
        this.app.get(url, handler);
    }

    addPostHandler(url: string, handler: (request, response) => void) {
        this.app.post(url, handler);
    }

    start() {
        this.app.use('/', express.static(path.join(this.context.extensionPath, 'frontend')));
        this.app.get('/*', (req, res) => {
            res.sendFile(path.join(this.context.extensionPath, 'frontend', 'index.html'))
        });
        const port = this.server.listen(0).address().port;
        console.log(`Starting express server on port: ${port}`);
        this.serverPort = port;
    }
}