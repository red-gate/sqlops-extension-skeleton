'use strict';

import * as vscode from 'vscode';
import * as sqlops from 'sqlops';
import BaseUri from './baseUri';
import LocalWebServer from "./localWebServer";
import ExtensionContext from "../extensionContext";
import ExtensionFacade from "../extensionFacade"

export class ExtensionProxy {
    private webServer: LocalWebServer;
    private extensionFacade: ExtensionFacade;

    constructor(context: ExtensionContext) {
        this.webServer = new LocalWebServer(context);
        this.extensionFacade = new ExtensionFacade(context);
    }

    start(): BaseUri {
        this.webServer.addGetHandler('/api/versions/extension', (request, response) => this.getExtensionVersion(request, response));
        this.webServer.addGetHandler('/api/versions/backend', (request, response) => this.getBackendVersion(request, response));
        this.webServer.addGetHandler('/api/connections', (request, response) => this.getConnections(request, response));
        this.webServer.start();
        return this.webServer.baseUri;
    }

    private async getExtensionVersion(request, response) {
        try {
            const version = "0.1.0";
            response.json({ version });
        } catch (error) {
            response.status(500)
                .send(`Fetch extension version failed with message "${error}"`);
            throw error;
        }
    }

    private async getBackendVersion(request, response) {
        try {
            const version = await this.extensionFacade.version();
            response.json(version);
        } catch (error) {
            response
                .status(500)
                .send(`Fetch backend version failed with message "${error}"`);
            throw error;
        }
    }

    private async getConnections(request, response) {
        try {
            const activeConnectionNodes = await sqlops.objectexplorer.getActiveConnectionNodes();

            const connections = activeConnectionNodes.map(node => ({
                connectionId: node.connectionId,
                label: node.label,
            }));
            response.json({ connections });
        } catch (error) {
            response
                .status(500)
                .send(`Fetch connections failed with message "${error}"`);
            throw error;
        }
    }
}