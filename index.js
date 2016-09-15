var path = require('path'),
    cpy = require('cpy'),
    del = require('del'),
    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site'),
    prepareData = require('./lib/prepare-data'),
    processDocs = require('./lib/process-docs'),
    processBlocks = require('./lib/process-blocks'),
    fsHelpers = require('./lib/fs-helpers'),

    bundleName = 'index',
    pathToBundle = path.resolve(__dirname, 'desktop.bundles', bundleName),
    BEMTREE = require(path.join(pathToBundle, bundleName + '.bemtree')).BEMTREE,
    BEMHTML = require(path.join(pathToBundle, bundleName + '.bemhtml')).BEMHTML;

module.exports = function(pathToData) {
    if (!pathToData) {
        throw new Error('Please provide path to library data');
    }

    var data = prepareData(pathToData, config),
        outputFolder = data.outputFolder;

    return del(outputFolder, { force: true }).then(function() {
        return Promise.all(data.langs.reduce(function(promises, lang) {
            var folder = path.join(outputFolder, lang);

            return promises.concat(
                fsHelpers.touch(path.join(folder, '.nojekyll')),
                cpy([
                    path.join(__dirname, 'desktop.bundles', 'index', 'index.{css,js}'),
                    path.join(__dirname, 'favicon.ico'),
                    path.join(pathToData, 'favicon.ico')
                ], folder),
                processDocs(data, lang, BEMTREE, BEMHTML),
                processBlocks(data, lang, BEMTREE, BEMHTML)
            );
        }, []))
    })
    .catch(console.error);
};
