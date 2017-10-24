'use strict';

var fs = require('fs'),
    path = require('path'),
    processPage = require('./process-page'),
    marked = require('marked'),
    markedOpts = require('./marked-opts');

module.exports = function(data, lang, bemtree, bemhtml) {
    var outputFolder = data.outputFolder,
        docs = data.docs;

    return Object.keys(docs).map(function(doc) {
        var isReadme = doc === 'readme',
            l = lang === 'en' ? '' : lang,
            pathToDoc = path.join(data.pathToData, docs[doc][l]);

        markedOpts.slugger && markedOpts.slugger.reset();

        return processPage(
            Object.assign({}, data, {
                page: {
                    title: (isReadme ? '' : doc + ' / ') + data.libraryName,
                    url: '/' + (isReadme ? '' : doc + '/'),
                    libRoot: (isReadme ? '' : '../'),
                    rootUrl: '/'
                },
                lang: lang,
                content: marked(fs.readFileSync(pathToDoc, 'utf8'), markedOpts)
            }),
            (isReadme ? '' : doc),
            bemtree,
            bemhtml
        );
    });
}
