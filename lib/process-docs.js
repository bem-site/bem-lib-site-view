var processPage = require('./process-page');

module.exports = function(data, lang, bemtree, bemhtml) {
    var outputFolder = data.outputFolder,
        docs = data.docs;

    return Object.keys(docs).map(function(doc) {
        var isReadme = doc === 'readme',
            l = lang === 'en' ? '' : lang;

        return processPage(
            Object.assign({}, data, {
                page: {
                    title: (isReadme ? '' : doc + ' / ') + data.libraryName,
                    url: '/' + (isReadme ? '' : doc + '/'),
                    libRoot: (isReadme ? '' : '../'),
                    rootUrl: '/'
                },
                lang: lang,

                // TODO: i18n
                content: docs[doc][l]
            }),
            (isReadme ? '' : doc),
            bemtree,
            bemhtml
        );
    });
}
