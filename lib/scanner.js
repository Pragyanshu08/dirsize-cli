import fs from 'fs/promises';
import path from 'path';

export async function scanDirectory(dir) {
  try {
    const stats = await fs.stat(dir);
    if (!stats.isDirectory()) return null;
  } catch (err) {
    console.error(`Error: Path "${dir}" does not exist.`);
    process.exit(1);
  }

  const children = [];
  let totalSize = 0;

  const items = await fs.readdir(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);

    // ❌ Skip .git entirely
    if (stat.isDirectory() && item === '.git') {
      continue;
    }

    // ✅ Include node_modules size, but skip scanning its children
    if (stat.isDirectory() && item === 'node_modules') {
      const moduleSize = await calculateFolderSize(fullPath);
      totalSize += moduleSize;
      children.push({ name: 'node_modules', size: moduleSize });
      continue;
    }

    // 📁 Regular folders
    if (stat.isDirectory()) {
      const sub = await scanDirectory(fullPath);
      if (sub) {
        totalSize += sub.size;
        children.push(sub);
      }
    } else {
      totalSize += stat.size;
      children.push({ name: item, size: stat.size });
    }
  }

  return { name: path.basename(dir), size: totalSize, children };
}

// 📦 Helper to calculate total size of a folder
async function calculateFolderSize(dir) {
  let size = 0;
  const items = await fs.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      size += await calculateFolderSize(fullPath);
    } else {
      size += stat.size;
    }
  }

  return size;
}
