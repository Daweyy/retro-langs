#!/usr/bin/env node
const { Command } = require('commander');

const Langs = require('./langs');

const program = new Command();

program
  .name('dofusretro-langs')
  .description('CLI utilities for DofusRetro Langs')
  .version('0.0.1');

program.command('watch')
  .description('Watch for changes')
  .option('-l, --language <string>', 'language you want to watch for (not specified = fr)')
  .option('-t, --time <number>', 'watch interval (in s)', 60)
  .option('-dl, --download', 'if you want to download files on changes')
  .option('-d, --dest <string>', 'destination directory (no specified = actual directory /langs)')
  .action(async (options) => {
    const langWatcher = new Langs(options.language, options.dest);
    langWatcher.watch(options.time, options.download);
    langWatcher.on('langs:update', ({ lang, files }) => {
      console.log(`[${lang}] Update detected ! (${files})`);
    });
    langWatcher.on('langs:downloaded', ({ lang, file, path }) => {
      console.log(`[${lang}] ${file} saved in ${path}`);
    });
  });

program.parse(process.argv);
