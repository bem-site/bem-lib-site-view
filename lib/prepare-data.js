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
        sets = versionData.sets,
        platforms = Object.keys(sets);

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

    return platforms.reduce(function(result, platform, index, array) {
        var blocks = sets[platform],
            blocksList = Object.keys(blocks).sort();

        if (libConfig.includeBlocks) {
            blocksList = _.intersection(blocksList, libConfig.includeBlocks);
        }

        if (libConfig.excludeBlocks) {
            blocksList = _.difference(blocksList, libConfig.excludeBlocks);
        }

        var blocksResult = blocksList.map(function(block) {
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
                // ??? делать это на уровне data ?
                example.path = path.resolve(path.join(outputFolder, lib), path.basename(example.path));
            });

            return {
                blockName: block,
                url: '/' + block,
                rootUrl: '/',
                blocks: blocksList,
                jsdoc: jsdoc,
                inlineExamples: examples.filter(function(example) { return example.source; }),
                examples: examples.filter(function(example) { return !example.source; }),
                examplesSources: examplesSources,
                // blockSources my be undefined when there's just redefinition and no docs
                blockSources: sourceFilesPath && require(path.resolve(pathToData, sourceFilesPath)).map(replaceFilesUrlsToGh),
                lib: {
                    name: lib,
                    version: version
                },
                content: content
            };
        });

        var l = lang === 'en' ? '' : lang;
        result[platform] = {
            readme: versionData.readme[l],
            changelog: versionData.changelog[l],
            migration: versionData.migration[l],
            blocks: blocksResult
        };

        return result;
    }, {});
};
