#!/usr/bin/env node

// Quick test to see if basic CLI structure works
const { Command } = require('commander');
const program = new Command();

program
  .name('test-cli')
  .description('Test CLI')
  .version('1.0.0');

program
  .command('test')
  .description('Test command')
  .option('-n, --name <name>', 'Your name')
  .action((options) => {
    console.log('Test command executed with name:', options.name || 'No name provided');
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log('No arguments provided, showing help');
  program.help();
}