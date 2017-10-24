'use strict';

var path = require('path'),
    fsHelpers = require('./fs-helpers');

module.exports = function(data, dir, bemtree, bemhtml) {
    return fsHelpers.write(
        path.join(data.outputFolder, data.lang, dir, 'index.html'),
        bemhtml.apply(bemtree.apply({ block: 'root', data: data }))
    );
};
