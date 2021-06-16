import { optimize, OptimizeOptions } from 'svgo';
import { compileTemplate } from '@vue/compiler-sfc';
import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

const defaultConfig: IVueSvgIconOptions = {
    className: 'svg-icon',
    flag: 'component',
    dir: 'icons',
}

interface IVueSvgIconOptions {
    className: string;
    dir: string;
    flag: string;
}


export function vueSvg(options: Partial<IVueSvgIconOptions> = {}): Plugin {
    const o = Object.assign(defaultConfig, options);
    let root: string;

    const icons: { [k: string]: string } = {};


    let timer = null;
    function complexFile() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const content = Object.keys(icons).reduce((str, path) => str += icons[path], '');
            fs.writeFileSync(path.join(root, o.dir, 'index.ts'), content);
        }, 50)
    }

    let finaly: Function;

    void new Promise(resolve => {
        finaly = resolve;
    })

    function getSvgName(p: string) {
        return path.relative(path.join(root, o.dir), p).replace(/\.svg/, '').replace(/[/_-]+?(\w)/g, (str, k: string) => {
            return k.toUpperCase();
        }).replace(/^\w/, (str) => str.toUpperCase()) + 'Icon';
    }

    function watchIcons() {
        const watcher = chokidar.watch(o.dir, { cwd: root });
        watcher.on('all', (event, p) => {
            if (['add', 'change'].includes(event)) {
                if (!/\.svg$/.test(p)) return;
                const svgName = getSvgName(p);
                icons[svgName] = `export { default as ${svgName} } from '${path.join(root, p)}?${o.flag}';\n`;
                complexFile();
            } else if (['unlink'].includes(event)) {
                const svgName = getSvgName(p);
                delete icons[svgName];
                complexFile();
            }
        }).on('ready', () => {
            finaly();
        });
    }

    return {
        name: 'svg-icon',
        enforce: 'pre',
        configResolved(config) {
            root = config.root;
            watchIcons();
        },
        async load(id) {
            if (id === path.join(root, o.dir, 'index.ts')) {
                await finaly;
                return fs.readFileSync(id, 'utf-8');
            }
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