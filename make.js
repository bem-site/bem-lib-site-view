var path = require('path')
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    rimraf = require('rimraf'),
    glob = require('glob'),
    marked = require('bem-md-renderer'),
    _ = require('lodash'),
    vow = require('vow'),

    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site-data'),
    // FIXME: platform hardcode
    platform = 'desktop',

    bundleName = 'index',
    pathToBundle = path.join(__dirname, 'desktop.bundles', bundleName),
    BEMTREE = require(path.join(pathToBundle, bundleName + '.bemtree')).BEMTREE,
    BEMHTML = require(path.join(pathToBundle, bundleName + '.bemhtml')).BEMHTML;

module.exports = function(pathToLib, pathToData, cb) {
    // TODO: removeme
    pathToLib = '../engino';
    pathToData = '../bem-lib-builder/ololo/data/engino';
    // ------------------

    var data = require(path.resolve(pathToData, 'data.json')),
        lib = Object.keys(data)[0],
        libConfig = config.libs[lib] || {}, // TODO: add reasonable fallbacks
        github = libConfig.github || {}, // TODO: вынимать из {bower,package}.json

        pathToBowerJson = path.join(pathToLib, 'bower.json'),
        libBowerConfig = fs.existsSync(pathToBowerJson) && require(pathToBowerJson),

        libName = libConfig.name || libBowerConfig.name || lib,
        libVersion = libBowerConfig.version,

        langs = typeof libConfig.langs !== 'undefined' ? libConfig.langs : config.langs;

    langs ? langs.forEach(function(lang) {
        init(lib, pathToData, lang);
    }) : init(lib, pathToData);

// --

function init(lib, pathToData, lang) {
    var outputFolder = path.resolve(config.outputFolder, lib),
        folder = lang ? path.join(outputFolder, lang) : outputFolder;

    rimraf.sync(folder);
    mkdirp.sync(folder);
    ['index.css', 'index.js'].forEach(function(file) {
        fs.createReadStream(path.join(__dirname, 'desktop.bundles', 'index', file))
            .pipe(fs.createWriteStream(path.join(folder, file)));
    });

    fs.createReadStream(path.join(__dirname, 'favicon.ico'))
        .pipe(fs.createWriteStream(path.join(folder, 'favicon.ico')));

    fs.writeFileSync(path.join(folder, '.nojekyll'), '');

    glob.sync(path.join(pathToData, lib, platform + '.examples', '*', '*')).forEach(function(folder) {
        var pathChunks = folder.split(path.sep),
            example = pathChunks.pop(),
            block = pathChunks.pop(),
            targetFolder = lang ? path.join(outputFolder, lang, block, example) : path.join(outputFolder, block, example);

        mkdirp.sync(targetFolder);

        // console.log('folder', folder);
        // console.log('targetFolder', targetFolder);
        ['html', 'js', 'css'].forEach(function(ext) {
            fs.createReadStream(path.join(folder, example + '.' + ext))
                .pipe(fs.createWriteStream(path.join(targetFolder, example + '.' + ext)));
        });
    });

    // "engino": {
    //     "3.0.0": {
    //         "sets": {
    //             "desktop": {

    var version = Object.keys(data[lib])[0],
        blocks = data[lib][version].sets[platform];

    processBlocks(blocks, pathToLib, libConfig, lang)
}

function processBlocks(blocks, pathToLib, libConfig, lang) {
    var lib = path.basename(pathToLib),
        blocksList = Object.keys(blocks).sort(),

        libConfig = config.libs[lib] || {}, // TODO: add reasonable fallbacks
        github = libConfig.github || {}, // TODO: вынивать из {bower,package}.json

        libBowerConfig = fs.existsSync(path.join(pathToLib, 'bower.json')) && require(path.join(pathToLib, 'bower.json')),

        libName = libConfig.name || libBowerConfig.name || lib,
        libVersion = libBowerConfig.version,

        langs = typeof libConfig.langs !== 'undefined' ? libConfig.langs : config.langs;

    if (libConfig.includeBlocks) {
        blocksList = _.intersection(blocksList, libConfig.includeBlocks);
    }

    if (libConfig.excludeBlocks) {
        blocksList = _.difference(blocksList, libConfig.excludeBlocks);
    }

    // index
    // var readmePromise = getReadme(pathToLib, lang, lib, function(err, readmeHtml) {
    //     return writeResult(lib, { title: 'Blocks', url: '/' },
    //     {
    //         lib: {
    //             name: libName,
    //             version: libVersion
    //         },
    //         langs: langs,
    //         currentLang: lang,
    //         blocks: blocksList,
    //         content: readmeHtml,
    //         isRoot: true
    //     },
    //     lang, '/');
    // });

    // blocks pages
    var promises = blocksList.map(function(block) {
        var blockData = blocks[block],
            metaPath = blockData['meta.json'],
            jsdocPath = blockData['jsdoc.json'],
            examplesFilesPath = blockData['examples-files.json'],
            examplesSources = examplesFilesPath && require(examplesFilesPath),
            sourceFilesPath = blockData['source-files.json'],
            docPath = blockData[(lang ? lang + '.' : '') + 'doc.html'],
            meta = metaPath && require(metaPath) || {},
            examples = meta.examples || [],
            jsdoc;

        try {
            jsdoc = jsdocPath && require(jsdocPath);
        } catch (e) {
            console.error('Error: Failed to evaluate', jsdocPath, e);
        }

        examplesSources && Object.keys(examplesSources).forEach(function(bundleName) {
            examplesSources[bundleName] = examplesSources[bundleName].map(replaceFilesUrlsToGh);
        });

        return writeResult(libName, { title: block, url: '/' + block },
            {
                lib: {
                    name: libName,
                    version: libVersion
                },
                langs: langs,
                currentLang: lang,
                blocks: blocksList,
                jsdoc: jsdoc,
                inlineExamples: examples.filter(function(example) { return example.source; }),
                examples: examples.filter(function(example) { return !example.source; }),
                examplesSources: examplesSources,
                // blockSources my be undefined when there's just redefinition and no docs
                blockSources: sourceFilesPath && require(sourceFilesPath).map(replaceFilesUrlsToGh),
                content: docPath && fs.readFileSync(docPath, 'utf8')
            }, lang, '/');
    });

    function replaceFilesUrlsToGh(item) {
        if (!github.repo) {
            // TODO: get rid of '../' replace after moving this module to the prj root
            item.path = item.path.replace(pathToLib.replace('../', ''), '');
            return item;
        }

        // TODO: get rid of '../' replace after moving this module to the prj root
        item.path = item.path.replace(pathToLib.replace('../', ''),
            // TODO: сорцы блока могут быть в библиотеках, от которых он зависит
            ['https:/', github.url, github.user, github.repo, 'blob', github.defaultBranch].join('/'));

        return item;
    }

    // return vow.all(promises.concat(readmePromise));
    return vow.all(promises);
}

}

function writeResult(lib, page, data, lang, rootUrl) {
    data.url = page.url;
    data.rootUrl = rootUrl;
    data.lang = lang;
    // data.content = content;
    // content: data.content.toString('utf8')

    var outputFolder = path.resolve(config.outputFolder, lib);

    var bemjson = BEMTREE.apply({
        block: 'root',
        data: data,
        title: page.title
    });

    var dirName = lang ? path.join(outputFolder, lang, page.url) : path.join(outputFolder, page.url);
    // var dirName = '.' + page.url;

    mkdirp.sync(dirName);
    fs.writeFileSync(path.join(dirName, 'index.html'), BEMHTML.apply(bemjson));
}