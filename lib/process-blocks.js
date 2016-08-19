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

module.exports = function(pathToData) {
    var rawData = require(path.resolve(pathToData, 'data')),
        lib = Object.keys(rawData)[0],
        version = Object.keys(rawData[lib])[0],
        libConfig = config.libs[lib] || {},
        langs = libConfig.langs || config.langs || [];

    return Promise.all(langs.map(function(lang) {
        var data = prepareData(pathToData, rawData, libConfig, lang);

        Object.keys(data).sort().map(function(platform) {
            var blocks = data[platform].blocks;

            blocks.map(function(block) {
                var blockName = block.blockName;

                var blockData = Object.assign({}, block, {
                    page: {
                        title: blockName,
                        url: '/' + blockName
                    },
                    outputFolder: outputFolder,
                    langs: langs,
                    currentLang: lang
                });

                var bemjson = BEMTREE.apply({
                    block: 'root',
                    data: blockData,
                    title: blockName
                });

                var html = BEMHTML.apply(bemjson),
                    filename = path.join(outputFolder, lib, lang, platform, blockName, 'index.html');

                return fsHelpers.write(filename, html);
            });
        });
    }));
};
