 var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

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

function readFile(pathToData, docPath) {
    return docPath && fs.readFileSync(path.join(pathToData, docPath), 'utf8');
}

/**
 *
 *
 */
module.exports = function(pathToData, config) {
    var data = require(path.resolve(pathToData, 'data')),

        lib = Object.keys(data)[0],
        version = Object.keys(data[lib])[0],
        versionData = data[lib][version],
        sets = versionData.sets,

        libConfig = config.libs[lib] || {},

        dataStub = {
            library: lib,
            version: version,
            config: libConfig,

            docs: {},
            sets: {},
            setsNames: Object.keys(sets).sort(),
            blockList: {},

            outputFolder: path.resolve(config.outputFolder),
            langs: libConfig.langs || config.langs || []
        };

    dataStub.langs.length || dataStub.langs.push('');

    // TODO: move to data
    dataStub.langs.forEach(function(lang) {
        var docs = {},
            l = lang === 'en' ? '' : lang;

        docs.readme = readFile(pathToData, versionData.readme[l]);
        docs.changelog = readFile(pathToData, versionData.changelog[l]);
        docs.migration = readFile(pathToData, versionData.migration[l]);

        dataStub.docs[lang] = docs;
    });

    return dataStub.setsNames.reduce(function(result, set) {
        var blocks = sets[set],
            blockList = Object.keys(blocks).sort(),
            libConfig = result.config;

        if (libConfig.includeBlocks) {
            blockList = _.intersection(blockList, libConfig.includeBlocks);
        }

        if (libConfig.excludeBlocks) {
            blockList = _.difference(blockList, libConfig.excludeBlocks);
        }

        var blocksResult = blockList.map(function(block) {
            var blockData = blocks[block],
                metaPath = blockData['meta.json'],
                jsdocPath = blockData['jsdoc.json'],
                examplesFilesPath = blockData['examples-files.json'],
                examplesSources = examplesFilesPath && require(path.resolve(pathToData, examplesFilesPath)),
                sourceFilesPath = blockData['source-files.json'],
                meta = metaPath && require(path.resolve(pathToData, metaPath)) || {},
                examples = meta.examples || [],
                jsdoc,
                content = {};

            try {
                jsdoc = jsdocPath && require(path.resolve(pathToData, jsdocPath));
            } catch (e) {
                console.error('Error: Failed to evaluate', jsdocPath, e);
            }

            // TODO: move to data
            result.langs.forEach(function(lang) {
                var docPath = blockData[(lang ? lang + '.' : '') + 'doc.html'];

                // TODO: use async
                content[lang] = docPath && fs.readFileSync(path.join(pathToData, docPath), 'utf8');
            });

            examplesSources && Object.keys(examplesSources).forEach(function(bundleName) {
                // console.log('examplesSources[bundleName]', examplesSources[bundleName]);
                examplesSources[bundleName] = examplesSources[bundleName].map(replaceFilesUrlsToGh);
            });

            examples.forEach(function(example) {
                // ??? делать это на уровне data ?
                example.path = path.resolve(path.join(result.outputFolder, lib), path.basename(example.path));
            });

            return {
                blockName: block,

                jsdoc: jsdoc,
                inlineExamples: examples.filter(function(example) { return example.source; }),
                examples: examples.filter(function(example) { return !example.source; }),
                examplesSources: examplesSources,
                // blockSources my be undefined when there's just redefinition and no docs
                blockSources: sourceFilesPath && require(path.resolve(pathToData, sourceFilesPath)).map(replaceFilesUrlsToGh),

                content: content
            };
        });

        // Full sets data, each block contains full info about it
        result.sets[set] = blocksResult;

        // List of block names for ToC
        result.blockList[set] = blockList;

        return result;
    }, dataStub);
};
