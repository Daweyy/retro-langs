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
    - ["update"](#update)
    - ["downloaded"](#downloaded)
    - ["watching"](#watching)
    - ["error"](#error)
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
**Emits**: [<code>update</code>](#Langs+update), 
[<code>downloaded</code>](#Langs+downloaded), 
[<code>watching</code>](#Langs+watching), 
[<code>error</code>](#Langs+error)

<a name="new_Langs_new"></a>

### new Langs(lang, [saveFolder])
Creates an instance of Langs.


| Param        | Type                | Default                        | Description                                           |
| ------------ | ------------------- | ------------------------------ | ----------------------------------------------------- |
| lang         | <code>string</code> |                                | Language to watch (if invalid 'fr' is used)           |
| [saveFolder] | <code>string</code> | <code>&quot;langs&quot;</code> | Folder used to save versions.json and swf langs files |
| build | <code>string</code> | <code>&quot;prod&quot;</code> | lang build type : prod (default), temporis or beta |

<a name="Langs+watch"></a>

### langs.watch(interval, [downloadNewFiles])
Watch remote versions.txt file

**Kind**: instance method of [<code>Langs</code>](#Langs)

| Param              | Type                 | Default            | Description                       |
| ------------------ | -------------------- | ------------------ | --------------------------------- |
| interval           | <code>number</code>  |                    | interval in seconds                    |
| [downloadNewFiles] | <code>boolean</code> | <code>false</code> | download new swf files on changes |

<a name="Langs+unwatch"></a>

### langs.unwatch()
Remove the watcher of the remote versions.txt file

**Kind**: instance method of [<code>Langs</code>](#Langs)
<a name="Langs+update"></a>

### "update"
Langs update event

**Kind**: event emitted by [<code>Langs</code>](#Langs)
**Properties**

| Name  | Type                              | Description                                  |
| ----- | --------------------------------- | -------------------------------------------- |
| lang  | <code>string</code>               | Language                                     |
| files | <code>Array.&lt;string&gt;</code> | Array of new files names (without extension) |
| build | <code>string</code> | lang build type |

<a name="Langs+downloaded"></a>

### "downloaded"
Lang downloaded event

**Kind**: event emitted by [<code>Langs</code>](#Langs)
**Properties**

| Name | Type                | Description                      |
| ---- | ------------------- | -------------------------------- |
| lang | <code>string</code> | Language                         |
| file | <code>string</code> | File name (without extension)    |
| path | <code>string</code> | Full path of the downloaded file |
| build | <code>string</code> | lang build type |

<a name="Langs+watching"></a>

### "watching"
Start watching langs event

**Kind**: event emitted by [<code>Langs</code>](#Langs)
**Properties**

| Name | Type                | Description                      |
| ---- | ------------------- | -------------------------------- |
| lang | <code>string</code> | Language                         |
| interval | <code>number</code> | interval in seconds          |
| saveFolder | <code>string</code> | Full path of the downloading directory |
| downloadNewFiles | <code>boolean</code> | download new swf files |
| build | <code>string</code> | lang build type |

<a name="Langs+error"></a>

### "error"
Error event

**Kind**: event emitted by [<code>Langs</code>](#Langs)
**Properties**

| Name | Type                | Description                      |
| ---- | ------------------- | -------------------------------- |
| error | <code>error</code> | Error message                   |

<a name="Langs+exemple"></a>

### Exemple
```js
const Langs = require('retro-langs');
/**
* Watched language is fr
* Working directory is ./output/dir/
* Lang build type is temporis (can also be 'beta' or 'prod' by default)
*/
const langWatcher = new Langs('fr', 'output/dir', 'temporis');

langWatcher.on('update', ({ lang, files, build }) => {
  // an update of langs is available
});

langWatcher.on('downloaded', ({ lang, file, path, build }) => {
  // a lang file has been downloaded
});

/**
* Watch every 60s
* Will be downloading every new files on changes
*/
langWatcher.watch(60, true); 
```
