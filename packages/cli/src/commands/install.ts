import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import pc from 'picocolors';

// Path to the nightwire root (two levels up from packages/cli)
const NIGHTWIRE_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

const FILES_TO_COPY = [
  { src: 'nightwire.css', dest: 'nightwire.css', label: 'Core CSS' },
  { src: 'tailwind.preset.js', dest: 'nightwire.tailwind.preset.js', label: 'Tailwind preset' },
  { src: 'DESIGN.md', dest: 'DESIGN.md', label: 'Design spec (AI context)' },
  { src: 'skill/nightwire/SKILL.md', dest: 'skill/nightwire/SKILL.md', label: 'AI skill' },
  { src: 'skill/nightwire/references/layouts.md', dest: 'skill/nightwire/references/layouts.md', label: 'Layout templates' },
  { src: 'skill/nightwire/references/examples.md', dest: 'skill/nightwire/references/examples.md', label: 'HTML examples' },
];

function detectProjectType(cwd: string): string {
  if (fs.existsSync(path.join(cwd, 'next.config.js')) || fs.existsSync(path.join(cwd, 'next.config.ts'))) return 'next';
  if (fs.existsSync(path.join(cwd, 'vite.config.ts')) || fs.existsSync(path.join(cwd, 'vite.config.js'))) return 'vite';
  if (fs.existsSync(path.join(cwd, 'astro.config.mjs'))) return 'astro';
  if (fs.existsSync(path.join(cwd, 'package.json'))) return 'node';
  return 'html';
}

function copyFile(src: string, dest: string, cwd: string): void {
  const srcPath = path.join(NIGHTWIRE_ROOT, src);
  const destPath = path.join(cwd, dest);
  const destDir = path.dirname(destPath);

  if (!fs.existsSync(srcPath)) {
    console.warn(pc.yellow(`  ! Skipped ${src} (not found in nightwire package)`));
    return;
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, destPath);
}

function printFontSnippet(): void {
  console.log('\n' + pc.dim('Add this to your HTML <head>:'));
  console.log(pc.cyan(`  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">`));
}

function printCSSSnippet(projectType: string): void {
  console.log('\n' + pc.dim('Import the CSS:'));
  if (projectType === 'next' || projectType === 'vite') {
    console.log(pc.cyan(`  @import './nightwire.css';`));
  } else {
    console.log(pc.cyan(`  <link rel="stylesheet" href="nightwire.css">`));
  }
}

function printTailwindSnippet(): void {
  console.log('\n' + pc.dim('Tailwind config:'));
  console.log(pc.cyan(`  import nightwirePreset from './nightwire.tailwind.preset.js'`));
  console.log(pc.cyan(`  export default { presets: [nightwirePreset] }`));
}

export async function install(): Promise<void> {
  const cwd = process.cwd();
  const projectType = detectProjectType(cwd);

  console.log(pc.blue([
    '',
    '███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗██╗    ██╗██╗██████╗ ███████╗',
    '████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝██║    ██║██║██╔══██╗██╔════╝',
    '██╔██╗ ██║██║██║  ███╗███████║   ██║   ██║ █╗ ██║██║██████╔╝█████╗  ',
    '██║╚██╗██║██║██║   ██║██╔══██║   ██║   ██║███╗██║██║██╔══██╗██╔══╝  ',
    '██║ ╚████║██║╚██████╔╝██║  ██║   ██║   ╚███╔███╔╝██║██║  ██║███████╗',
    '╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚══╝╚══╝ ╚═╝╚═╝  ╚═╝╚══════╝',
  ].join('\n')));
  console.log(pc.dim('                                        暗黒専用サイバーパンク設計体系\n'));

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `Install Nightwire into ${pc.cyan(path.basename(cwd))}?`,
    initial: true,
  });

  if (!confirm) {
    console.log(pc.dim('\nAborted.'));
    process.exit(0);
  }

  const { includeTailwind } = await prompts({
    type: 'confirm',
    name: 'includeTailwind',
    message: 'Include Tailwind CSS preset?',
    initial: fs.existsSync(path.join(cwd, 'tailwind.config.js')) || fs.existsSync(path.join(cwd, 'tailwind.config.ts')),
  });

  const { includeSkill } = await prompts({
    type: 'confirm',
    name: 'includeSkill',
    message: 'Include AI skill files (SKILL.md, DESIGN.md) for Claude/Cursor/Copilot?',
    initial: true,
  });

  console.log('');

  // Always copy core CSS
  const filesToInstall = FILES_TO_COPY.filter(f => {
    if (f.src.includes('tailwind') && !includeTailwind) return false;
    if ((f.src.includes('skill') || f.src.includes('SKILL') || f.src.includes('DESIGN')) && !includeSkill) return false;
    return true;
  });

  for (const file of filesToInstall) {
    copyFile(file.src, file.dest, cwd);
    console.log(pc.green('  ✓') + ` ${file.label} ${pc.dim('→ ' + file.dest)}`);
  }

  console.log('\n' + pc.bold(pc.green('Nightwire installed successfully!')));
  console.log(pc.dim(`Detected project type: ${projectType}\n`));

  printFontSnippet();
  printCSSSnippet(projectType);
  if (includeTailwind) printTailwindSnippet();

  console.log('\n' + pc.dim('Docs: ') + pc.cyan('https://github.com/cativo23/nightwire'));
  console.log(pc.dim('設計体系文書 — nightwire.cativo.dev\n'));
}
