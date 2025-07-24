import chalk from 'chalk';

const icons = {
  folder: '📁',
  nodeModules: '📦',
  js: '📜',
  ts: '📘',
  json: '🗂️',
  config: '⚙️',
  defaultFile: '📄',
};

export function printTree(node, indent = '', isLast = true) {
  const marker = isLast ? '└── ' : '├── ';
  const treePrefix = indent + (isLast ? '    ' : '│   ');

  let displayName = node.name;
  let icon = icons.defaultFile;

  if (node.children) {
    icon = node.name === 'node_modules' ? icons.nodeModules : icons.folder;
    displayName = chalk.blue.bold(displayName);
  } else if (node.name.endsWith('.js')) {
    icon = icons.js;
    displayName = chalk.green(displayName);
  } else if (node.name.endsWith('.ts')) {
    icon = icons.ts;
    displayName = chalk.cyan(displayName);
  } else if (node.name.match(/\.(json|yml|yaml|toml)$/)) {
    icon = icons.config;
    displayName = chalk.yellow(displayName);
  }

  console.log(
    indent + marker +
    icon + ' ' + displayName +
    chalk.gray(` (${formatSize(node.size)})`)
  );

  if (node.children) {
    const childCount = node.children.length;
    node.children.forEach((child, index) => {
      const isChildLast = index === childCount - 1;
      printTree(child, treePrefix, isChildLast);
    });
  }
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}
