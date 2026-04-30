"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const picocolors_1 = __importDefault(require("picocolors"));
// Path to the nightwire root (two levels up from packages/cli)
const NIGHTWIRE_ROOT = path_1.default.resolve(__dirname, '..', '..', '..', '..');
const FILES_TO_COPY = [
    { src: 'nightwire.css', dest: 'nightwire.css', label: 'Core CSS' },
    { src: 'tailwind.preset.js', dest: 'nightwire.tailwind.preset.js', label: 'Tailwind preset' },
    { src: 'DESIGN.md', dest: 'DESIGN.md', label: 'Design spec (AI context)' },
    { src: 'skill/nightwire/SKILL.md', dest: 'skill/nightwire/SKILL.md', label: 'AI skill' },
    { src: 'skill/nightwire/references/layouts.md', dest: 'skill/nightwire/references/layouts.md', label: 'Layout templates' },
    { src: 'skill/nightwire/references/examples.md', dest: 'skill/nightwire/references/examples.md', label: 'HTML examples' },
];
function detectProjectType(cwd) {
    if (fs_1.default.existsSync(path_1.default.join(cwd, 'next.config.js')) || fs_1.default.existsSync(path_1.default.join(cwd, 'next.config.ts')))
        return 'next';
    if (fs_1.default.existsSync(path_1.default.join(cwd, 'vite.config.ts')) || fs_1.default.existsSync(path_1.default.join(cwd, 'vite.config.js')))
        return 'vite';
    if (fs_1.default.existsSync(path_1.default.join(cwd, 'astro.config.mjs')))
        return 'astro';
    if (fs_1.default.existsSync(path_1.default.join(cwd, 'package.json')))
        return 'node';
    return 'html';
}
function copyFile(src, dest, cwd) {
    const srcPath = path_1.default.join(NIGHTWIRE_ROOT, src);
    const destPath = path_1.default.join(cwd, dest);
    const destDir = path_1.default.dirname(destPath);
    if (!fs_1.default.existsSync(srcPath)) {
        console.warn(picocolors_1.default.yellow(`  ! Skipped ${src} (not found in nightwire package)`));
        return;
    }
    fs_1.default.mkdirSync(destDir, { recursive: true });
    fs_1.default.copyFileSync(srcPath, destPath);
}
function printFontSnippet() {
    console.log('\n' + picocolors_1.default.dim('Add this to your HTML <head>:'));
    console.log(picocolors_1.default.cyan(`  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">`));
}
function printCSSSnippet(projectType) {
    console.log('\n' + picocolors_1.default.dim('Import the CSS:'));
    if (projectType === 'next' || projectType === 'vite') {
        console.log(picocolors_1.default.cyan(`  @import './nightwire.css';`));
    }
    else {
        console.log(picocolors_1.default.cyan(`  <link rel="stylesheet" href="nightwire.css">`));
    }
}
function printTailwindSnippet() {
    console.log('\n' + picocolors_1.default.dim('Tailwind config:'));
    console.log(picocolors_1.default.cyan(`  import nightwirePreset from './nightwire.tailwind.preset.js'`));
    console.log(picocolors_1.default.cyan(`  export default { presets: [nightwirePreset] }`));
}
async function install() {
    const cwd = process.cwd();
    const projectType = detectProjectType(cwd);
    console.log('\n' + picocolors_1.default.bold(picocolors_1.default.blue('NIGHTWIRE')) + picocolors_1.default.dim(' — Dark Cyberpunk UI Design System'));
    console.log(picocolors_1.default.dim('設計体系インストーラー\n'));
    const { confirm } = await (0, prompts_1.default)({
        type: 'confirm',
        name: 'confirm',
        message: `Install Nightwire into ${picocolors_1.default.cyan(path_1.default.basename(cwd))}?`,
        initial: true,
    });
    if (!confirm) {
        console.log(picocolors_1.default.dim('\nAborted.'));
        process.exit(0);
    }
    const { includeTailwind } = await (0, prompts_1.default)({
        type: 'confirm',
        name: 'includeTailwind',
        message: 'Include Tailwind CSS preset?',
        initial: fs_1.default.existsSync(path_1.default.join(cwd, 'tailwind.config.js')) || fs_1.default.existsSync(path_1.default.join(cwd, 'tailwind.config.ts')),
    });
    const { includeSkill } = await (0, prompts_1.default)({
        type: 'confirm',
        name: 'includeSkill',
        message: 'Include AI skill files (SKILL.md, DESIGN.md) for Claude/Cursor/Copilot?',
        initial: true,
    });
    console.log('');
    // Always copy core CSS
    const filesToInstall = FILES_TO_COPY.filter(f => {
        if (f.src.includes('tailwind') && !includeTailwind)
            return false;
        if ((f.src.includes('skill') || f.src.includes('SKILL') || f.src.includes('DESIGN')) && !includeSkill)
            return false;
        return true;
    });
    for (const file of filesToInstall) {
        copyFile(file.src, file.dest, cwd);
        console.log(picocolors_1.default.green('  ✓') + ` ${file.label} ${picocolors_1.default.dim('→ ' + file.dest)}`);
    }
    console.log('\n' + picocolors_1.default.bold(picocolors_1.default.green('Nightwire installed successfully!')));
    console.log(picocolors_1.default.dim(`Detected project type: ${projectType}\n`));
    printFontSnippet();
    printCSSSnippet(projectType);
    if (includeTailwind)
        printTailwindSnippet();
    console.log('\n' + picocolors_1.default.dim('Docs: ') + picocolors_1.default.cyan('https://github.com/cativo23/nightwire'));
    console.log(picocolors_1.default.dim('設計体系文書 — nightwire.cativo.dev\n'));
}
