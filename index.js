var path = require('path'),
    cpy = require('cpy'),
    del = require('del'),
    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site-data'),
    prepareData = require('./lib/prepare-data'),
    processDocs = require('./lib/process-docs'),
    processBlocks = require('./lib/process-blocks'),
    fsHelpers = require('./lib/fs-helpers'),

    bundleName = 'index',
    pathToBundle = path.resolve(__dirname, 'desktop.bundles', bundleName),
    BEMTREE = require(path.join(pathToBundle, bundleName + '.bemtree')).BEMTREE,
    BEMHTML = require(path.join(pathToBundle, bundleName + '.bemhtml')).BEMHTML;

module.exports = function(pathToData) {
    // TODO: перенести все, что здесь не потребовалось в process-blocks
    if (!pathToData) {
        throw new Error('Please provide path to library data');
    }

    var data = prepareData(pathToData, config),
        outputFolder = data.outputFolder,
        langs = data.langs;

    return del(outputFolder, { force: true }).then(function() {
        return Promise.all(langs.reduce(function(promises, lang) {
            var folder = path.join(outputFolder, lang),
                setsNames = data.setsNames,
                setsGlob = setsNames.length > 1 ? '{' + setsNames.join() + '}' : setsNames[0];

            return promises.concat(
                [
                    fsHelpers.touch(path.join(folder, '.nojekyll')),
                    cpy([
                        path.join(__dirname, 'desktop.bundles', 'index', 'index.{css,js}'),
                        path.join(__dirname, 'favicon.ico'),
                        path.join(pathToData, 'favicon.ico')
                    ], folder),
                    // cpy([path.join(pathToData, setsGlob + '.examples', '**', '*.{html,css,js}')], outputFolder),
                ],
                processDocs(data, lang, BEMTREE, BEMHTML),
                processBlocks(data, lang, BEMTREE, BEMHTML)
            );
        }, []))
    })
    .catch(console.error);
};
