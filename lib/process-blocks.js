var path = require('path'),
    processPage = require('./process-page');

module.exports = function(data, lang, bemtree, bemhtml) {
    var outputFolder = data.outputFolder;

    return data.setsNames.reduce(function(result, setName) {
        data.sets[setName].forEach(function(block) {
            var blockName = block.blockName;

            result.push(processPage(
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
            ));
        });

        return result;
    }, []);
};
