import * as vscode from 'vscode';

import fs = require('fs');
import { start } from './mvvmCreate';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('easymvvmmaker.create', (e) => {

		vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: '输入文件名',
		}).then(function (msg) {
			var stat = fs.lstatSync(e.fsPath);

			if (stat.isDirectory()) {
				start(msg, e.fsPath);
			} else {
				var dir = e.fsPath.substring(0, e.fsPath.lastIndexOf("/"));
				start(msg, dir);
			}
		});
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }
