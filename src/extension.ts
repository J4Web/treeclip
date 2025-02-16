import * as vscode from "vscode";
import * as fs from "fs";
import { readdir, stat } from "fs/promises";
import { basename } from "path";
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		'extension.copyFolderStructure',
		async (uri: vscode.Uri) => {
			try {
				const structure = await getFolderStructure(uri.fsPath);
				await vscode.env.clipboard.writeText(structure);
				vscode.window.showInformationMessage('Folder structure copied to clipboard!');
			} catch (error) {
				vscode.window.showErrorMessage('Failed to copy folder structure');
				console.error(error);
			}
		}
	);

	context.subscriptions.push(disposable);
}


async function getFolderStructure(path: string, depth = 0) {
	const stats = await stat(path);

	if (stats.isFile()) {
		const name: string = basename(path);
		return name;
	}

	if (!stats.isDirectory()) {
		return '';
	}

	const dir: string[] = await readdir(path);
	let rootdir: string = basename(path);

	for (const item of dir) {
		rootdir += '\n' + ' '.repeat(depth + 1) + '├── ' + await getFolderStructure(path + '/' + item, depth + 2);
	}

	return rootdir;
}

export function deactivate() { }