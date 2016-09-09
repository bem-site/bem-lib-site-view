var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),

    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site-data'),

    // ???
    outputFolder = config.outputFolder;

module.exports = function(pathToData, data, libConfig, lang) {
    var lib = Object.keys(data)[0],
        version = Object.keys(data[lib])[0],
        versionData = data[lib][version];
        sets = versionData.sets;

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

    var resultData = Object.keys(sets).reduce(function(result, set, index, array) {
        var blocks = sets[set],
            blockList = Object.keys(blocks).sort();

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
                examplesSources = undefined, // examplesFilesPath && require(path.resolve(pathToData, examplesFilesPath)),
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
                // ??? делать это на уровне data ?
                example.path = path.resolve(path.join(outputFolder, lib), path.basename(example.path));
            });

            return {
                blockName: block,

                // TODO: оно не нужно тут, но без этого падает, найти где идёт обращение и выкосить
                blocks: blockList,

                // TODO: это не относится к данным блока, нужно строить это вне этого модуля
                url: '/' + block,
                rootUrl: '/',

                jsdoc: jsdoc,
                inlineExamples: examples.filter(function(example) { return example.source; }),
                examples: examples.filter(function(example) { return !example.source; }),
                examplesSources: examplesSources,
                // blockSources my be undefined when there's just redefinition and no docs
                blockSources: sourceFilesPath && require(path.resolve(pathToData, sourceFilesPath)).map(replaceFilesUrlsToGh),

                // TODO: вынести на уровень выше
                lib: {
                    name: lib,
                    version: version
                },
                content: content
            };
        });

        // Full sets data, each block contains full info about it
        result.sets[set] = blocksResult;

        // List of block names for ToC
        result.blockList[set] = blockList;

        return result;
    }, {
        blockList: {},
        sets: {}
    });

    var l = lang === 'en' ? '' : lang;

    resultData.readme = versionData.readme[l];
    resultData.changelog = versionData.changelog[l];
    resultData.migration = versionData.migration[l];

    return resultData;
};
