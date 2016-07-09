var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    fsHelpers = require('./fs-helpers'),

    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site-data'),

    bundleName = 'index',
    pathToBundle = path.resolve(__dirname, '..', 'desktop.bundles', bundleName),
    BEMTREE = require(path.join(pathToBundle, bundleName + '.bemtree')).BEMTREE,
    BEMHTML = require(path.join(pathToBundle, bundleName + '.bemhtml')).BEMHTML,

    outputFolder = config.outputFolder;

module.exports = function(pathToData) {
    var data = require(path.resolve(pathToData, 'data')),
        lib = Object.keys(data)[0],
        version = Object.keys(data[lib])[0],
        sets = data[lib][version].sets,
        platforms = Object.keys(sets),
        libConfig = config.libs[lib] || {},
        langs = libConfig.langs || config.langs || [];

    function replaceFilesUrlsToGh(item) {
        // if (!github.repo) {
        //     // TODO: get rid of '../' replace after moving this module to the prj root
        //     item.path = item.path.replace(pathToLib.replace('../', ''), '');
        //     return item;
        // }

        // // TODO: get rid of '../' replace after moving this module to the prj root
        // item.path = item.path.replace(pathToLib.replace('../', ''),
        //     // TODO: сорцы блока могут быть в библиотеках, от которых он зависит
        //     ['https:/', github.url, github.user, github.repo, 'blob', github.defaultBranch].join('/'));

        return item;
    }

    return Promise.all(langs.map(function(lang) {
        return platforms.map(function(platform) {
            var blocks = sets[platform],
                blocksList = Object.keys(blocks).sort();

            if (libConfig.includeBlocks) {
                blocksList = _.intersection(blocksList, libConfig.includeBlocks);
            }

            if (libConfig.excludeBlocks) {
                blocksList = _.difference(blocksList, libConfig.excludeBlocks);
            }

            return blocksList.map(function(block) {
                var blockData = blocks[block],
                    metaPath = blockData['meta.json'],
                    jsdocPath = blockData['jsdoc.json'],
                    examplesFilesPath = blockData['examples-files.json'],
                    examplesSources = examplesFilesPath && require(path.resolve(pathToData, examplesFilesPath)),
                    sourceFilesPath = blockData['source-files.json'],
                    docPath = blockData[(lang ? lang + '.' : '') + 'doc.html'],
                    // TODO: use async
                    content = docPath && fs.readFileSync(path.join(pathToData, docPath), 'utf8'),
                    meta = metaPath && require(path.resolve(pathToData, metaPath)) || {},
                    examples = meta.examples || [],
                    jsdoc;

                try {
                    jsdoc = jsdocPath && require(path.resolve(pathToData, jsdocPath));
                } catch (e) {
                    console.error('Error: Failed to evaluate', jsdocPath, e);
                }

                examplesSources && Object.keys(examplesSources).forEach(function(bundleName) {
                    // console.log('examplesSources[bundleName]', examplesSources[bundleName]);
                    examplesSources[bundleName] = examplesSources[bundleName].map(replaceFilesUrlsToGh);
                });

                examples.forEach(function(example) {
                    example.path = path.resolve(path.join(outputFolder, lib), path.basename(example.path));
                });

                var data = {
                    page: {
                        title: block,
                        url: '/' + block
                    },
                    url: '/' + block,
                    rootUrl: '/',
                    outputFolder: outputFolder,
                    langs: langs,
                    currentLang: lang,
                    lib: {
                        name: lib,
                        version: version
                    },
                    blocks: blocksList,
                    jsdoc: jsdoc,
                    inlineExamples: examples.filter(function(example) { return example.source; }),
                    examples: examples.filter(function(example) { return !example.source; }),
                    examplesSources: examplesSources,
                    // blockSources my be undefined when there's just redefinition and no docs
                    blockSources: sourceFilesPath && require(path.resolve(pathToData, sourceFilesPath)).map(replaceFilesUrlsToGh),
                    content: content
                };

                var bemjson = BEMTREE.apply({
                    block: 'root',
                    data: data,
                    title: block
                });

                var html = BEMHTML.apply(bemjson),
                    filename = path.join(outputFolder, lib, lang, platform, block, 'index.html');

                return fsHelpers.write(filename, html);
            });
        });
    }))
};
