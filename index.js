var path = require('path'),
    cpy = require('cpy'),
    del = require('del'),
    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site-data'),
    processBlocks = require('./lib/process-blocks'),
    fsHelpers = require('./lib/fs-helpers');

module.exports = function(pathToData) {
    // TODO: перенести все, что здесь не потребовалось в process-blocks
    var data = require(path.resolve(pathToData, 'data')),
        lib = Object.keys(data)[0],
        libConfig = config.libs[lib] || {},
        github = libConfig.github || {},
        version = Object.keys(data[lib])[0],
        sets = data[lib][version].sets,
        platforms = Object.keys(sets),
        langs = libConfig.langs || config.langs || [],
        bowerData,

        outputFolder = path.resolve(config.outputFolder, lib);

    try {
        bowerData = require(path.resolve(pathToData, 'bower'));
    } catch(err) {}


    langs.length || langs.push('');

    return del(outputFolder).then(function() {
        return Promise.all(langs.map(function(lang) {
            var folder = path.join(outputFolder, lang);

            return Promise.all([
                fsHelpers.touch(path.join(folder, '.nojekyll')),
                cpy([
                    path.join(__dirname, 'desktop.bundles', 'index', 'index.{css,js}'),
                    path.join(__dirname, 'favicon.ico'),
                    path.join(pathToData, 'favicon.ico')
                ], folder),
                cpy([path.join(pathToData, '{' + platforms.join() + '}' + '.examples', '**', '*.{html,css,js}')], outputFolder)
            ]).then(function() { return processBlocks(pathToData); });
        }));
    })
    // TODO: remove
    .catch(console.error);
};
