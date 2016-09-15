block('root').replace()(function() {
    var path = require('path'),
        data = this.ctx.data,
        page = data.page,
        url = page.url,
        rootUrl = page.rootUrl,
        // FIXME:
        site = rootUrl === '/' ? 'index' : rootUrl.split('/')[1],
        cssPath = path.join(path.relative(url, rootUrl), site + '.css'),
        jsPath = path.join(path.relative(url, rootUrl), site + '.js');

    this.data = data;

    return {
        block: 'page',
        title: page.title,
        head: [
            { elem: 'css', url: cssPath }
        ],
        scripts: [
            { elem: 'js', url: jsPath }
        ],
        mods: {
            theme: 'islands',
            site: site
        }
    };
});
