block('header').content()(function() {
    var data = this.data,
        rootUrl = data.rootUrl,
        url = data.url;

    return [
        {
            block: 'logo',
            mix: { block: 'header', elem: 'logo' },
            url: url !== rootUrl ? rootUrl : undefined
        },
        {
            block: 'breadcrumbs',
            mix: { block: 'header', elem: 'breadcrumbs' }
        },
        data.langs.length > 1 ? {
            elem: 'item',
            content: [
                // {
                //     block: 'search'
                // },
                {
                    block: 'lang-switcher',
                    js: { currentLang: data.currentLang } // TODO: try to get rid of it
                }
            ]
        } : ''
    ];
});
