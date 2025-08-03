#!/usr/bin/env node

const { Command } = require('commander');
const { install, installSinglePackage } = require('./installer');
const { getStorePath } = require('./store');

const program = new Command();

program
  .name('mini-pnpm')
  .description('A simple pnpm implementation')
  .version('1.0.0');

program
  .command('install')
  .description('Install dependencies from package.json')
  .option('-g, --global', 'Install globally')
  .option('-r, --registry <registry>', 'Set registry (npm, taobao, or custom URL)')
  .option('--max-depth <depth>', 'Maximum dependency depth (default: 3)', parseInt)
  .option('--max-packages <count>', 'Maximum package count (default: 50)', parseInt)
  .action(async (options) => {
    try {
      await install(options);
      console.log('✅ Installation completed successfully!');
    } catch (error) {
      console.error('❌ Installation failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('add <package>')
  .description('Install a single package')
  .option('-g, --global', 'Install globally')
  .option('-r, --registry <registry>', 'Set registry (npm, taobao, or custom URL)')
  .option('--max-depth <depth>', 'Maximum dependency depth (default: 3)', parseInt)
  .option('--max-packages <count>', 'Maximum package count (default: 50)', parseInt)
  .option('--package-version <version>', 'Package version to install')
  .action(async (packageName, options) => {
    try {
      const version = options.packageVersion || 'latest';
      await installSinglePackage(packageName, version, options);
      console.log('✅ Package installed successfully!');
    } catch (error) {
      console.error('❌ Package installation failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('store')
  .description('Show store information')
  .action(() => {
    const storePath = getStorePath();
    console.log('Store path:', storePath);
  });

program.parse(); 