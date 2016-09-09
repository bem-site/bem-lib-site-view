block('root').replace()(function() {
    var path = require('path'),
        ctx = this.ctx,
        data = ctx.data,
        page = data.page,
        rootUrl = page.rootUrl,
        url = page.url,
        // FIXME:
        site = rootUrl === '/' ? 'index' : rootUrl.split('/')[1],
        cssPath = site + '.css',
        jsPath = site + '.js';

    // console.log('url', url, 'rootUrl', rootUrl, 'rel', path.relative(url, rootUrl))

    this.data = ctx.data;

    if (url !== '/') {
        cssPath = path.join('..', path.relative(url, rootUrl), cssPath);
        jsPath = path.join('..', path.relative(url, rootUrl), jsPath);
    }

    return {
        block: 'page',
        title: ctx.title,
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
