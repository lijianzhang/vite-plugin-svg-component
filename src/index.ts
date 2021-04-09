import { optimize, OptimizeOptions } from 'svgo';
import { compileTemplate } from '@vue/compiler-sfc';
import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import './svg';
const defaultConfig: IVueSvgIconOptions = {
    className: 'svg-icon',
    flag: 'component',
}

interface IVueSvgIconOptions {
    className: string;
    flag: string;
}


export function vueSvg(options: Partial<IVueSvgIconOptions> = {}): Plugin {
    const o = Object.assign(defaultConfig, options);
    return {
        name: 'svg-icon',
        enforce: 'pre',
        async load(id) {
            const [filename, search] = id.split('?');
            if (/\.svg$/.test(filename) && search === o.flag) {
                const { data: content } = optimize(fs.readFileSync(filename, 'utf-8'), {
                    path: id,
                    full: true,
                });
                const svgName = path.basename(filename, '.svg');
                const template = content.replace('<svg', `<svg class="${o.className} ${svgName}"  name="${svgName}" `);
                const { code } = compileTemplate({ source: template, id: id, filename });
                return `${code}\nexport default render;`;
            }
            return null;
        }
    }
}