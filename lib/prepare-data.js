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

/**
 *
 *
 */
module.exports = function(pathToData, config) {
    var rawData = require(path.resolve(pathToData, 'data')),
        libConfig = config.libs[rawData.library] || {},
        sets = rawData.sets,
        data = Object.assign({
            config: libConfig,
            blockList: {},
            setsNames: Object.keys(sets).sort(),
            outputFolder: path.resolve(config.view && config.view.outputFolder || 'output'),
            langs: libConfig.langs || config.langs || []
        }, rawData);

    data.langs.length || data.langs.push('');

    // TODO: move to data
    data.langs.forEach(function(lang) {
        var docs = data.docs,
            l = lang === 'en' ? '' : lang;

        docs.readme[l] = docs.readme[l] && fs.readFileSync(path.join(pathToData, docs.readme[l]), 'utf8');
        docs.changelog[l] = docs.changelog[l] && fs.readFileSync(path.join(pathToData, docs.changelog[l]), 'utf8');
        docs.migration[l] = docs.migration[l] && fs.readFileSync(path.join(pathToData, docs.migration[l]), 'utf8');
    });

    return data.setsNames.reduce(function(result, set) {
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
                example.path = path.resolve(path.join(result.outputFolder, data.library), path.basename(example.path));
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
    }, data);
};
