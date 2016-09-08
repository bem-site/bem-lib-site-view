var path = require('path'),
    cpy = require('cpy'),
    del = require('del'),
    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site-data'),
    processBlocks = require('./lib/process-blocks'),
    fsHelpers = require('./lib/fs-helpers');

module.exports = function(pathToData) {
    // TODO: перенести все, что здесь не потребовалось в process-blocks
    if (!pathToData) {
        throw new Error('Please provide path to library data');
    }

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

    return del(outputFolder, { force: true }).then(function() {
        return Promise.all(langs.map(function(lang) {
            var folder = path.join(outputFolder, lang),
                platformsGlob = platforms.length > 1 ? '{' + platforms.join() + '}' : platforms[0];

            return Promise.all([
                fsHelpers.touch(path.join(folder, '.nojekyll')),
                cpy([
                    path.join(__dirname, 'desktop.bundles', 'index', 'index.{css,js}'),
                    path.join(__dirname, 'favicon.ico'),
                    path.join(pathToData, 'favicon.ico')
                ], folder),
                cpy([path.join(pathToData, platformsGlob + '.examples', '**', '*.{html,css,js}')], outputFolder)
            ]).then(function() { return processBlocks(pathToData); });
        }));
    })
    // TODO: remove
    .catch(console.error);
};
