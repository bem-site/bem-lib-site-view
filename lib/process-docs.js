var processPage = require('./process-page'),

    // TODO: move to data
    docs = [
        {
            doc: 'migration',
            title: '!!!migration',
            url: 'migration'
        },
        {
            doc: 'changelog',
            title: '!!!changelog',
            url: 'changelog'
        },
        {
            doc: 'readme',
            title: '!!!INDEX',
            url: ''
        },
    ];

module.exports = function(data, lang, bemtree, bemhtml) {
    var outputFolder = data.outputFolder;

    return docs.map(function(doc) {
        return processPage(
            Object.assign({}, data, {
                setPath: (doc.url !== '' ? '../' : '') + 'desktop',
                blockList: data.blockList['desktop'],
                page: {
                    title: doc.title,
                    url: '/' + doc.url,
                    rootUrl: '/'
                },
                lang: lang,
                content: data.docs[doc.doc][lang === 'en' ? '' : lang]
            }),
            doc.url,
            bemtree,
            bemhtml
        );
    });
}
