block('nav').content()(function() {
    var data = this.data,
        page = data.page,
        url = page.url;

    return Object.keys(data.docs).filter(function(doc) {
        return doc !== 'readme';
    }).map(function(doc) {
        var isCurrent = url === '/' + doc + '/';

        return {
            block: 'link',
            mix: { block: 'nav', elem: 'link' },
            url: !isCurrent && (data.blockName ? '../../' : url !== '/' ? '../' : '') + doc + '/',
            content: doc
        }
    });
/*
    var data = this.data,
        rootUrl = data.rootUrl,
        lang = data.lang;

    return data.model.filter(function(item) {
        if (/^\/forum/.test(item.url)) return true;
        if (!new RegExp('^' + rootUrl).test(item.url)) return;
        return item.url.split('/').length === rootUrl.split('/').length + 1;
    }).map(function(item) {
        var isCurrent = this.data.url === item.url,
            title = typeof item.title === 'string' ? item.title : item.title[lang];

        return {
            elem: 'item',
            elemMods: { current: isCurrent },
            content: isCurrent ? title : {
                block: 'link',
                url: item.url,
                content: title
            }
        };
    }, this);
*/
});
