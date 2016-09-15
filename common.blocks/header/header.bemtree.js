block('header').content()(function() {
    var data = this.data,
        page = data.page,
        rootUrl = page.rootUrl,
        url = page.url;

    return [
        {
            block: 'logo',
            mix: { block: 'header', elem: 'logo' },
            url: url !== rootUrl && rootUrl
        },
        {
            block: 'breadcrumbs',
            mix: { block: 'header', elem: 'breadcrumbs' }
        },
        {
            block: 'nav',
            mix: { block: 'header', elem: 'docs' }
        },
        data.langs.length > 1 && {
            block: 'lang-switcher',
            mix: { block: 'header', elem: 'lang' },
            js: { lang: data.lang } // TODO: try to get rid of it
        }
    ];
});
