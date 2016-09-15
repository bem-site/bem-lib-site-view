var path = require('path'),
    cpy = require('cpy'),
    processPage = require('./process-page');

module.exports = function(data, lang, bemtree, bemhtml) {
    var outputFolder = data.outputFolder;

    return data.setsNames.reduce(function(result, setName) {
        data.sets[setName].forEach(function(block) {
            var blockName = block.blockName,
                // TODO: надо ли копировать прям все файлы из примера?
                examplesSrc = path.join(data.pathToData, setName + '.examples', blockName, '*', '*'),
                examplesDest = path.join(outputFolder, lang, setName, blockName);

            result.push(cpy([examplesSrc], examplesDest).then(function() {
                return processPage(
                    Object.assign({}, data, block, {
                        blockList: data.blockList[setName],
                        setName: setName,
                        page: {
                            title: blockName,
                            url: '/' + setName + '/' + blockName,
                            rootUrl: '/'
                        },
                        lang: lang
                    }),
                    path.join(setName, blockName),
                    bemtree,
                    bemhtml
                );
            }));
        });

        return result;
    }, []);
};
