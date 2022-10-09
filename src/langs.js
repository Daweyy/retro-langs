const axios = require('axios');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const pLimit = require('p-limit');
const pRetry = require('p-retry');

const RETRO_CDN = 'https://dofusretro.cdn.ankama.com';
const LANGUAGES = ['fr', 'en', 'es', 'de', 'pt', 'it', 'nl'];
const MAX_CONCURRENT_DL = 5;
const BUILDS = ['prod', 'beta', 'temporis'];

/**
 * Langs update event
 *
 * @event Langs#langs:update
 * @type {object}
 * @property {string} lang - Language
 * @property {string[]} files - Array of new files names (without extension)
 * @property {string} build - Lang type build (prod, beta, temporis)

 */

/**
 * Lang downloaded event
 *
 * @event Langs#langs:downloaded
 * @type {object}
 * @property {string} lang - Language
 * @property {string} file - File name (without extension)
 * @property {string} path - Full path of the downloaded file
 * @property {string} build - Lang type build (prod, beta, temporis)
 */

/**
 * Error event
 * 
 * @event Langs#langs:error
 * @type {object}
 * @property {Error} error - Error message
 */

/**
 * Watch versions.txt file on DofusRetro CDN
 * @fires Langs#langs:update
 * @fires Langs#langs:downloaded
 * @fires Langs#langs:error
 */
class Langs extends EventEmitter {
  /**
   * Creates an instance of Langs.
   * @param {string} lang - Language to watch (if invalid 'fr' is used)
   * @param {string} [saveFolder=langs] - Folder used to save versions.json and swf langs files
   * @param {string} 
   */
  constructor(lang, saveFolder = 'langs', build = 'prod') {
    super();
    this.lang = (LANGUAGES.includes(lang)) ? lang : 'fr';
    this.build = (BUILDS.includes(build.toLowerCase())) ? build : 'prod';
    this.saveFolder = path.resolve(path.join(saveFolder, this.build));
    this.lastModifiedHeader = null;
    this.versionFileContent = this.getLastData();
    this.lastData = this.versionFileContent[this.lang];
    this.watchInterval = null;
    this.downloadNewFiles = false;
    this.addQueue = pLimit(MAX_CONCURRENT_DL);
  }

  getLastData() {
    try {
      return JSON.parse(fs.readFileSync(`${this.saveFolder}/versions.json`).toString().trim());
    } catch (e) {
      return {};
    }
  }

  saveData(data) {
    if (!fs.existsSync(this.saveFolder)) {
      fs.mkdirSync(this.saveFolder, { recursive: true });
    }
    // update file content, in case there have been some changes (multiples watchers running ...)
    this.versionFileContent = this.getLastData();
    this.versionFileContent[this.lang] = data;
    fs.writeFileSync(`${this.saveFolder}/versions.json`, JSON.stringify(this.versionFileContent));
  }

  /**
   * Watch remote versions.txt file
   * @param {number} interval - interval in ms
   * @param {boolean} [downloadNewFiles=false] - download new swf files on changes
   * @memberof Langs
   */
  watch(interval, downloadNewFiles = false) {
    if (this.watchInterval) {
      throw new Error('Cannot watch multiple times (memory leaks)');
    }
    this.downloadNewFiles = downloadNewFiles;
    this.emit('watching', {
      lang: this.lang,
      interval,
      saveFolder: this.saveFolder,
      downloadNewFiles: this.downloadNewFiles,
      build: this.build,
    });
    this.watchInterval = setInterval(this.watcher.bind(this), interval * 1000);
    this.watcher();
  }

  /**
   * Remove the watcher of the remote versions.txt file
   */
  unwatch() {
    clearInterval(this.watchInterval);
    this.watchInterval = null;
  }

  async downloadFiles(files) {
    const currentLangFolder = path.resolve(this.saveFolder, this.lang);
    if (!fs.existsSync(currentLangFolder)) {
      fs.mkdirSync(currentLangFolder, { recursive: true });
    }

    try {
      const toDownload = [];
      files.forEach((file) => {
        toDownload.push(this.addQueue(async () => {
          const buildPart = (this.build === 'prod') ? '' : `/${this.build}`;
          await pRetry(async () => {
            const response = await axios({
              method: 'get',
              url: `${RETRO_CDN}${buildPart}/lang/swf/${file}.swf`,
              responseType: 'stream',
            });
            const stream = response.data.pipe(fs.createWriteStream(path.resolve(currentLangFolder, `${file}.swf`)));
            stream.on('finish', () => {
              this.emit('downloaded', {
                lang: this.lang,
                file,
                path: path.resolve(currentLangFolder, `${file}.swf`),
                build: this.build,
              });
            });
          }, { retries: 3 });
        }));
      });
      await Promise.all(toDownload);
    } catch (error) {
      this.emit('error', error);
    }
  }

  onUpdate(files) {
    this.saveData(files);
    this.emit('update', {
      lang: this.lang,
      files,
      build: this.build,
    });
    if (this.downloadNewFiles) {
      this.downloadFiles(files);
    }
  }

  async watcher() {
    const run = async () => {
      try {
        const buildPart = (this.build === 'prod') ? '' : `/${this.build}`;
        const response = await axios({
          method: 'GET',
          url: `${RETRO_CDN}${buildPart}/lang/versions_${this.lang}.txt`,
        });
        if (response.status === 200) {
          if (this.lastModifiedHeader !== response.headers['last-modified']) {
            const data = response.data || {};
            let langFiles = [];

            this.lastModifiedHeader = response.headers['last-modified'];

            langFiles = data.substring(3, data.length - 1).split('|');
            langFiles = langFiles.map((x) => x.replaceAll(',', '_'));

            if (!this.lastData || JSON.stringify(this.lastData) !== JSON.stringify(langFiles)) {
              this.onUpdate(langFiles);
            }
          }
        }
      } catch (error) {
        this.emit('error', error);
      }
    };

    try {
      await pRetry(run, { retries: 3 });
    } catch (error) {
      this.emit('error', error);
    }
  }
}

module.exports = Langs;
