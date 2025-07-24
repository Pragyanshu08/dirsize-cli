#!/usr/bin/env node

import { scanDirectory } from '../lib/scanner.js';
import { printTree } from '../lib/printer.js';
import path from 'path';

const targetDir = process.argv[2] || '.';

const tree = await scanDirectory(path.resolve(targetDir));
printTree(tree);