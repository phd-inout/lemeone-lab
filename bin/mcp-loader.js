#!/usr/bin/env node

/**
 * Lemeone-Lab MCP Remote Loader
 * This script allows running the TS-based MCP server without pre-compilation
 * by utilizing 'tsx' dynamically.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const serverPath = path.join(rootDir, 'mcp-server', 'index.js');

// 检查是否存在 tsx，如果不存在则提示或尝试运行
// 在 npx 环境下，我们可以尝试通过 npx 再次调用 tsx
const args = [
  '--import', 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("tsx/esm", pathToFileURL("./"));',
  serverPath,
  ...process.argv.slice(2)
];

// 简单的方案：直接用 npx tsx 启动
const child = spawn('npx', ['-y', 'tsx', serverPath, ...process.argv.slice(2)], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});
