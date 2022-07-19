/* eslint-disable @typescript-eslint/naming-convention */

import { existsSync, PathLike, promises } from 'fs';
import { dirname } from 'path';
import { createInterface } from 'readline';
import { Stream } from 'stream';
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});
let panelName = '';
function getModelDesc() {
    let name = `${panelName}Model`;
    return 'export interface ' + name + '{}';
}

function getViewHolderDesc() {
    let name = `${panelName}ViewHolder`;

    return 'import {Group, ViewHolder} from "doric";\n' +
        '\n' +
        'export class ' + name + ' extends ViewHolder {\n' +
        '    build(root: Group): void {\n' +
        '    }\n' +
        '}';
}

function getViewModelDesc() {
    let viewModelName = `${panelName}ViewModel`;
    let modelName = `${panelName}Model`;
    let viewHolderName = `${panelName}ViewHolder`;

    return 'import {ViewModel} from "doric";\n' +
        'import {' + modelName + '} from ' + '"./' + modelName + '";\n' +
        'import {' + viewHolderName + '} from ' + '"./' + viewHolderName + '";\n\n' +
        'export class ' + viewModelName + ' extends ViewModel<' + modelName + ', ' + viewHolderName + '>{\n' +
        '    onAttached(state: ' + modelName + ', vh: ' + viewHolderName + '): void {\n' +
        '    }\n' +
        '\n' +
        '    onBind(state: ' + modelName + ', vh: ' + viewHolderName + '): void {\n' +
        '    }\n' +
        '\n' +
        '}';
}

function getPanelDesc() {
    let viewModelName = `${panelName}ViewModel`;
    let modelName = `${panelName}Model`;
    let viewHolderName = `${panelName}ViewHolder`;
    let pageName = `${panelName}Panel`;

    return 'import {VMPanel} from "doric";\n' +
        'import {' + modelName + '} from "./' + modelName + '";\n' +
        'import {' + viewModelName + '} from "./' + viewModelName + '";\n' +
        'import {' + viewHolderName + '} from "./' + viewHolderName + '";\n' +
        '\n' +
        '@Entry\n' +
        'export class ' + pageName + ' extends VMPanel<' + modelName + ', ' + viewHolderName + '> {\n' +
        '    getState(): ' + modelName + ' {\n' +
        '        return {};\n' +
        '    }\n' +
        '\n' +
        '    getViewHolderClass() {\n' +
        '        return ' + viewHolderName + ';\n' +
        '    }\n' +
        '\n' +
        '    getViewModelClass() {\n' +
        '        return ' + viewModelName + ';\n' +
        '    }\n' +
        '}';
}

export function start(name: string | undefined, dir: any) {
    if (name) {
        panelName = name;
        let modelPath = `${dir}/${panelName}Model.ts`;
        let viewHolderPath = `${dir}/${panelName}ViewHolder.ts`;
        let viewModelPath = `${dir}/${panelName}ViewModel.ts`;
        let panelPath = `${dir}/${panelName}Panel.ts`;


        let p_model = new Promise((resolve, reject) => {
            makedir(modelPath, getModelDesc(), (res: unknown) => { resolve(res); }, (error: any) => reject(error));
        });

        let p_ViewHolder = new Promise((resolve, reject) => {
            makedir(viewHolderPath, getViewHolderDesc(), (res: unknown) => { resolve(res); }, (error: any) => reject(error));
        });

        let p_ViewModel = new Promise((resolve, reject) => {
            makedir(viewModelPath, getViewModelDesc(), (res: unknown) => { resolve(res); }, (error: any) => reject(error));
        });

        let p_Panel = new Promise((resolve, reject) => {
            makedir(panelPath, getPanelDesc(), (res: unknown) => { resolve(res); }, (error: any) => reject(error));
        });

        Promise.all([p_model, p_ViewHolder, p_ViewModel, p_Panel]).then(res => {
            console.log(`执行成功，如有需要，请复制以下路径到根目录的index.ts文件：\n src/${panelName.toLowerCase()}/${panelName}Panel`);
        }).catch(error => {
            console.log('执行过程发生错误:' + error);
        });

        rl.close();
    }
}

function makedir(filePath: string, text: string | Stream | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView>, callback: { (res: any): void; (res: any): void; (res: any): void; (res: any): void; (arg0: string): void; }, error: { (error: any): void; (error: any): void; (error: any): void; (error: any): void; (arg0: string): void; }) {
    if (!existsSync(filePath)) {
        promises.mkdir(dirname(filePath), { recursive: true })
            .then(x => promises.writeFile(filePath, text).then(res => {
                if (callback) {
                    callback(`生成${filePath}成功\n......`);
                }
            }));
    } else {
        if (error) {
            error(`${filePath} 已存在`);
        }
    }
}