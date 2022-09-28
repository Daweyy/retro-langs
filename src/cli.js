#!/usr/bin/env node
const { Command } = require('commander');
const path = require('path');

const Langs = require('./langs');

const program = new Command();

program
  .name('dofusretro-langs')
  .description('CLI utilities for DofusRetro Langs')
  .version('1.1.0');

program.command('watch')
  .description('Watch for changes')
  .option('-l, --language <string>', 'language you want to watch for (not specified = fr)')
  .option('-t, --time <number>', 'watch interval (in s)', 60)
  .option('-dl, --download', 'if you want to download files on changes')
  .option('-d, --dest <string>', 'destination directory (no specified = actual directory /langs)')
  .action(async (options) => {
    const langWatcher = new Langs(options.language, options.dest);
    langWatcher.on('update', ({ lang, files }) => {
      console.log(`[${lang}] Update detected ! (${files})`);
    });
    langWatcher.on('downloaded', ({ lang, file, path }) => {
      console.log(`[${lang}] ${file} saved in ${path}`);
    });
    langWatcher.on('watching', ({ lang, interval, saveFolder, downloadNewFiles }) => {
      console.log(`[${lang}] Watching for changes (${interval}s)`);
      if (downloadNewFiles) {
        console.log(`[${lang}] Changes will be downloaded into ${path.join(saveFolder, lang)}`);
      }
    });
    langWatcher.on('error', (error) => {
      console.error(error);
    });
    langWatcher.watch(options.time, options.download);
  });

program.parse(process.argv);
