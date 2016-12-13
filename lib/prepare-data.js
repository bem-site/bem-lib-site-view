 var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

/**
 *
 *
 */
module.exports = function(pathToData, config) {
    config = config || {};

    var rawData = require(path.resolve(pathToData, 'data')),
        libConfig = config.libs && config.libs[rawData.library] || {},
        libName = rawData.library + (rawData.version ? ('@' + rawData.version) : ''),
        sets = rawData.sets,
        github = libConfig.github || {},
        data = Object.assign({
            config: libConfig,
            libraryName: libName,
            pathToData: pathToData,
            outputFolder: path.resolve(config.view && config.view.outputFolder || 'output'),
            langs: libConfig.langs || config.langs || []
        }, rawData);

    function replaceFilesUrlsToGh(item) {
        if (!github.repo) {
            return item;
        }

        var githubPath = ['https:/', github.url, github.user, github.repo, 'blob', 'v' + rawData.version, ''].join('/');
        // TODO: сорцы блока могут быть в библиотеках, от которых он зависит
        item.path = githubPath + item.path;

        return item;
    }

    data.langs.length || data.langs.push('');

    var setsList = Object.keys(sets).sort().map(function(setName) {
        return {
            name: setName,
            blocks: Object.keys(sets[setName]).sort()
        }
    });
    data.setsList = setsList;

    return setsList.reduce(function(result, set) {
        var blocks = sets[set.name],
            blocksList = set.blocks,
            libConfig = result.config;

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
                setsList: setsList,

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
        result.sets[set.name] = blocksResult;

        return result;
    }, data);
};
