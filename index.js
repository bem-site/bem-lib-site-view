var path = require('path'),
    bemConfig = require('bem-config')(),
    config = bemConfig.moduleSync('bem-lib-site-data');

module.exports = function(pathToData) {
    var data = require(path.resolve(pathToData, 'data')),
        lib = Object.keys(data)[0];

    console.log(lib);
};