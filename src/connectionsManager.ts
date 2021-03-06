import * as vscode from 'vscode';
import { JenkinsService } from './jenkinsService';
import { QuickpickSet } from './quickpickSet';
import { ext } from './extensionVariables';
import { ConnectionsTreeItem } from './connectionsTree';

export class ConnectionsManager implements QuickpickSet {
    private _host: JenkinsService;

    public constructor() {
        ext.context.subscriptions.push(vscode.commands.registerCommand('extension.jenkins-jack.connections.select', async (item?: ConnectionsTreeItem) => {
            await this.selectConnection(item?.connection);
        }));

        ext.context.subscriptions.push(vscode.commands.registerCommand('extension.jenkins-jack.connections.add', async () => {
            await this.addConnection();
        }));

        ext.context.subscriptions.push(vscode.commands.registerCommand('extension.jenkins-jack.connections.delete', async (item?: ConnectionsTreeItem) => {
            await this.deleteConnection(item?.connection);
        }));

        this.updateSettings();
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('jenkins-jack.jenkins.connections')) {
                this.updateSettings();
            }
        });
    }

    public get commands(): any[] {
        return [
            {
                label: "$(settings)  Host Selection",
                description: "Select a jenkins host to connect to.",
                target: async () => vscode.commands.executeCommand('extension.jenkins-jack.connections.select')
            },
            {
                label: "$(add)  Add Host Connection",
                description: "Add a jenkins host via input prompts.",
                target: async () => vscode.commands.executeCommand('extension.jenkins-jack.connections.add')
            },
            {
                label: "$(circle-slash)  Delete Host Connection",
                description: "Delete a jenkins host connection from settings.",
                target: async () => vscode.commands.executeCommand('extension.jenkins-jack.connections.delete')
            }
        ];
    }

    public get host(): JenkinsService {
        return this._host;
    }

    public async display() {
        let result = await vscode.window.showQuickPick(this.commands, { placeHolder: 'Jenkins Jack' });
        if (undefined === result) { return; }
        return result.target();
    }

    /**
     * Updates the settings for this service.
     */
    public updateSettings() {
        let config = vscode.workspace.getConfiguration('jenkins-jack.jenkins');
        let conn: any;
        for (let c of config.connections) {
            if (c.active) {
                conn = c;
                break;
            }
        }
        if (undefined === conn) {
            throw new Error("You must select a host connection to use the plugin's features");
        }

        if (undefined !== this.host) {
            this.host.dispose();
        }
        this._host = new JenkinsService(conn.name, conn.uri, conn.username, conn.password);
    }

    /**
     * Provides an input flow for adding in a host to the user's settings.
     */
    public async addConnection() {
        let config = vscode.workspace.getConfiguration('jenkins-jack.jenkins');

        // Have user enter a unique name for the host. If host name already exists, try again.
        let hostName: string | undefined = undefined;
        while (true) {
            hostName = await vscode.window.showInputBox({
                prompt: 'Enter in a unique name for your jenkins connection (e.g. JenkyMcJunklets)'
            });
            if (undefined === hostName) { return undefined; }

            if (!config.connections.some((c: any) => c.name === hostName)) {
                break;
            }
            vscode.window.showWarningMessage(`There is already a connection named "${hostName}". Please choose another.`);
        }

        let hostUri = await vscode.window.showInputBox({
            prompt: 'Enter in your host uri, including protocol (e.g. http://127.0.0.1:8080)',
            value: 'http://127.0.0.1:8080'
        });
        if (undefined === hostUri) { return undefined; }

        let username = await vscode.window.showInputBox({
            prompt: 'Enter in a username for authentication'
        });
        if (undefined === username) { return undefined; }

        let password = await vscode.window.showInputBox({
            prompt: `Enter in the password of "${username}" for authentication`
        });
        if (undefined === password) { return undefined; }

        this._host = new JenkinsService(hostName, hostUri, username, password);

        // Add the connection to the list and make it the active one
        config.connections.forEach((c: any) => c.active = false);
        config.connections.push({
            "name": hostName,
            "uri": hostUri,
            "username": username,
            "password": password,
            "active": true
        });

        vscode.workspace.getConfiguration().update('jenkins-jack.jenkins.connections', config.connections, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Jenkins Jack: Host updated to ${hostName}: ${hostUri}`);

        // Refresh the connection tree and it's dependent tree views
        vscode.commands.executeCommand('extension.jenkins-jack.tree.connections.refresh');
    }

    public async deleteConnection(conn?: any) {
        let config = vscode.workspace.getConfiguration('jenkins-jack.jenkins');
        if (!conn) {
            let hosts = [];
            for (let c of config.connections) {
                hosts.push({
                    label: c.name,
                    description: `${c.uri} (${c.username})`,
                    target: c
                });
            }

            let result = await vscode.window.showQuickPick(hosts);
            if (undefined === result) { return undefined; }
            conn = result.target;
        }

        // Remove connection and update global config.
        let modifiedConnections = config.connections.filter((c: any) => {
            return c.name !== conn.name;
        });
        await vscode.workspace.getConfiguration().update('jenkins-jack.jenkins.connections', modifiedConnections, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage(`Host "${conn.name} ${conn.uri}" removed`);

        // If this host was active, make the first host in the list active.
        if (conn.active) {
            return await this.selectConnection(modifiedConnections[0]);
        }

        // Refresh the connection tree and it's dependent tree views
        vscode.commands.executeCommand('extension.jenkins-jack.tree.connections.refresh');
    }

    /**
     * Displays the quicpick host/connection selection list for the user.
     * Active connection is updated in the global config upon selection.
     * If connection already provided, config is just updated and associated
     * treeViews are refreshed.
     */
    public async selectConnection(conn?: any) {
        let config = vscode.workspace.getConfiguration('jenkins-jack.jenkins');
        if (!conn) {
            let hosts = [];
            for (let c of config.connections) {
                let activeIcon = c.active ? "$(primitive-dot)" : "$(dash)";
                hosts.push({
                    label: `${activeIcon} ${c.name}`,
                    description: `${c.uri} (${c.username})`,
                    target: c
                });
            }

            let result = await vscode.window.showQuickPick(hosts);
            if (undefined === result) { return; }
            conn = result.target;
        }

        this._host.dispose();
        this._host = new JenkinsService(conn.name, conn.uri, conn.username, conn.password);

        // Update settings with active host.
        for (let c of config.connections) {
            c.active  = (conn.name === c.name &&
                conn.uri === c.uri &&
                conn.username === c.username &&
                conn.password === c.password);
        }

        vscode.workspace.getConfiguration().update('jenkins-jack.jenkins.connections', config.connections, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Jenkins Jack: Host updated to ${conn.name}: ${conn.uri}`);

        // Refresh the connection tree and it's dependent tree views
        vscode.commands.executeCommand('extension.jenkins-jack.tree.connections.refresh');
    }
}
