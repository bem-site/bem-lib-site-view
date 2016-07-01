block('root').replace()(function() {
    var path = require('path'),
        ctx = this.ctx,
        data = ctx.data,
        rootUrl = data.rootUrl,
        url = data.url,
        // FIXME:
        site = rootUrl === '/' ? 'index' : rootUrl.split('/')[1];

    // console.log('url', url, 'rootUrl', rootUrl, 'rel', path.relative(url, rootUrl))

    this.data = ctx.data;

    return {
        block: 'page',
        title: ctx.title,
        head: [
            { elem: 'css', url: path.join(path.relative(url, rootUrl), 'index.css') }
        ],
        scripts: [
            { elem: 'js', url: path.join(path.relative(url, rootUrl), 'index.js') }
        ],
        mods: {
            theme: 'islands',
            site: site
        }
    };
});
