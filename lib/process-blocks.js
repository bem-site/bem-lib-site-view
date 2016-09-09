var fs = require('fs'),
    path = require('path'),
    fsHelpers = require('./fs-helpers'),
    prepareData = require('./prepare-data'),

    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site-data'),

    bundleName = 'index',
    pathToBundle = path.resolve(__dirname, '..', 'desktop.bundles', bundleName),
    BEMTREE = require(path.join(pathToBundle, bundleName + '.bemtree')).BEMTREE,
    BEMHTML = require(path.join(pathToBundle, bundleName + '.bemhtml')).BEMHTML,

    outputFolder = config.outputFolder;

module.exports = function(pathToData, langs, lang) {
    var rawData = require(path.resolve(pathToData, 'data')),
        lib = Object.keys(rawData)[0],
        version = Object.keys(rawData[lib])[0],
        libConfig = config.libs[lib] || {},
        data = prepareData(pathToData, rawData, libConfig, lang),
        sets = data.sets;

    return Promise.all(Object.keys(sets).sort().map(function(setName) {
        return Promise.all(sets[setName].map(function(block) {
            var blockName = block.blockName;

            var bemjson = BEMTREE.apply({
                block: 'root',
                title: blockName,
                data: Object.assign({}, block, {
                    blockList: data.blockList[setName],
                    setName: setName,
                    page: {
                        title: blockName,
                        url: '/' + blockName,
                        rootUrl: '/'
                    },
                    outputFolder: outputFolder,
                    langs: langs,
                    currentLang: lang
                })
            });

            var html = BEMHTML.apply(bemjson),
                filename = path.join(outputFolder, lib, lang, setName, blockName, 'index.html');

            return fsHelpers.write(filename, html);
        }));
    })).then(function() {
        return Promise.all(
            [
                {
                    doc: 'migration',
                    title: '!!!migration',
                    url: 'migration'
                },
                // {
                //     doc: 'changelog',
                //     title: '!!!changelog',
                //     url: 'changelog'
                // },
                {
                    doc: 'readme',
                    title: '!!!INDEX',
                    url: ''
                },
            ].map(function(doc) {
                var bemjson = BEMTREE.apply({
                    block: 'root',
                    title: doc.title,
                    data: {
                        lib: {
                            name: 'bem-components',
                            version: '3.0.0'
                        },
                        setPath: 'desktop',
                        blockList: data.blockList['desktop'],
                        page: {
                            title: doc.title,
                            url: '/' + doc.url,
                            rootUrl: '/'
                        },
                        outputFolder: outputFolder,
                        langs: langs,
                        currentLang: lang,
                        content: data[doc.doc]
                    }
                });

                var html = BEMHTML.apply(bemjson),
                    filename = path.join(outputFolder, lib, lang, doc.url, 'index.html');

console.log(filename);
                fsHelpers.touch(filename)
                return fsHelpers.write(filename, html);
            })
        );
    });
};
