# DofusRetro-Langs 

Allows you to watch and download langs files for Dofus Retro.

Is available through a CLI and Class usable in your own code 

(Thanks [@drag0une](https://github.com/drag0une) for his work)


# Table of contents
- [DofusRetro-Langs](#dofusretro-langs)
- [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [CLI](#cli)
  - [Langs](#langs)
    - [new Langs(lang, [saveFolder])](#new-langslang-savefolder)
    - [langs.watch(interval, [downloadNewFiles])](#langswatchinterval-downloadnewfiles)
    - [langs.unwatch()](#langsunwatch)
    - ["langs:update"](#langsupdate)
    - ["langs:downloaded"](#langsdownloaded)
    - [Exemple](#exemple)

<a name="Installation"></a>

## Installation

You can install the retro-langs package with npm
```bash
npm i --save retro-langs
```

If you want to use the cli everywhere you can add the **-g** option

<a name="CLI"></a>

## CLI
You can follow the instruction of the help command of the cli

```bash
retro-langs --help
retro-langs [command] --help
```

<a name="Langs"></a>

## Langs
Watch versions.txt file on DofusRetro CDN

**Kind**: global class
**Emits**: [<code>langs:update</code>](#Langs+langs_update), [<code>langs:downloaded</code>](#Langs+langs_downloaded)

<a name="new_Langs_new"></a>

### new Langs(lang, [saveFolder])
Creates an instance of Langs.


| Param        | Type                | Default                        | Description                                           |
| ------------ | ------------------- | ------------------------------ | ----------------------------------------------------- |
| lang         | <code>string</code> |                                | Language to watch (if invalid 'fr' is used)           |
| [saveFolder] | <code>string</code> | <code>&quot;langs&quot;</code> | Folder used to save versions.json and swf langs files |

<a name="Langs+watch"></a>

### langs.watch(interval, [downloadNewFiles])
Watch remote versions.txt file

**Kind**: instance method of [<code>Langs</code>](#Langs)

| Param              | Type                 | Default            | Description                       |
| ------------------ | -------------------- | ------------------ | --------------------------------- |
| interval           | <code>number</code>  |                    | interval in ms                    |
| [downloadNewFiles] | <code>boolean</code> | <code>false</code> | download new swf files on changes |

<a name="Langs+unwatch"></a>

### langs.unwatch()
Remove the watcher of the remote versions.txt file

**Kind**: instance method of [<code>Langs</code>](#Langs)
<a name="Langs+langs_update"></a>

### "langs:update"
Langs update event

**Kind**: event emitted by [<code>Langs</code>](#Langs)
**Properties**

| Name  | Type                              | Description                                  |
| ----- | --------------------------------- | -------------------------------------------- |
| lang  | <code>string</code>               | Language                                     |
| files | <code>Array.&lt;string&gt;</code> | Array of new files names (without extension) |

<a name="Langs+langs_downloaded"></a>

### "langs:downloaded"
Lang downloaded event

**Kind**: event emitted by [<code>Langs</code>](#Langs)
**Properties**

| Name | Type                | Description                      |
| ---- | ------------------- | -------------------------------- |
| lang | <code>string</code> | Language                         |
| file | <code>string</code> | File name (without extension)    |
| path | <code>string</code> | Full path of the downloaded file |

<a name="Langs+exemple"></a>

### Exemple
```js
const Langs = require('retro-langs');
/**
* Watched language is fr
* Working directory will be ./output/dir/
*/
const langWatcher = new Langs('fr', 'output/dir');

langWatcher.on('langs:update', ({ lang, files }) => {
  // an update of langs is available
});

langWatcher.on('langs:downloaded', ({ lang, file, path }) => {
  // a lang file has been downloaded
});

/**
* Watch every 60s
* Will be downloading every new files on changes
*/
langWatcher.watch(60, true); 
```
