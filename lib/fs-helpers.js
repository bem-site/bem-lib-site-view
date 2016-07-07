var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp');

function mkdir(dirname) {
    return new Promise(function(resolve, reject) {
        mkdirp(dirname, function(err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

function exists(filename) {
    var dirname = path.dirname(filename);

    return new Promise(function(resolve, reject) {
        fs.stat(dirname, function(err, doesExists) {
            if (err) {
                return err.code === 'ENOENT' ? resolve(false) : reject(err);
            }

            return true;
        });
    });
}

function write(filename, content) {
    var dirname = path.dirname(filename);

    return exists(dirname).then(function(doesExists) {
        return (doesExists ? Promise.resolve() : mkdir(dirname))
            .then(function() {
                return new Promise(function(resolve, reject) {
                    fs.writeFile(filename, content, function(err) {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
    });
}

function touch(filename) {
    return write(filename, '');
}

module.exports = {
    write: write,
    touch: touch,
    exists: exists,
    mkdir: mkdir
};
