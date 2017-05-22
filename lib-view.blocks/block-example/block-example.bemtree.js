block('block-example').content()(function() {
    var fs = require('fs'),
        ctx = this.ctx,
        data = ctx.data,
        lang = data.lang,
        bundleName = ctx.name,
        pathToHtml = ctx.pathToHtml,
        blockName = data.blockName,
        examplesUrlPrefix = data.examplesUrlPrefix || '../../..',
        htmlUrl = examplesUrlPrefix + '/' + data.setName + '/' + blockName + '/' + bundleName + (lang ? '.' + lang : '') + '.html',
        exampleSources = data.examplesSources && data.examplesSources[bundleName] || [];

    data.mode === 'server' && console.log(require('child_process').execSync(path.resolve('./node_modules/.bin/magic') + ' make ' + url, {
        cwd: path.resolve('.'),
        env: process.env
    }).toString());

    function getDeps() {
        return fs.readFileSync(pathToHtml + '.deps.html', 'utf8');
    }

    function getBemjson() {
        return fs.readFileSync(pathToHtml + '.bemjson.html', 'utf8');
    }

    function getHtml() {
        return fs.readFileSync(pathToHtml + '.html.html', 'utf8');
    };

    return [
        {
            elem: 'info',
            content: [
                {
                    block: 'link',
                    mods: { theme: 'islands' },
                    url: htmlUrl,
                    target: '_blank',
                    content: 'Open in a new window'
                },
                exampleSources.length ? {
                    block: 'dropdown',
                    mods: { switcher : 'link', theme : 'islands', size : 'm' },
                    switcher: 'Custom blocks',
                    popup: {
                        tag: 'ul',
                        content: exampleSources.map(function(example) {
                            return {
                                tag: 'li',
                                content: {
                                    block: 'link',
                                    url: example.path,
                                    content: example.path
                                }
                            };
                        })
                    }
                } : '',
                {
                    block: 'dropdown',
                    mods: { switcher : 'link', theme : 'islands', size : 'm' },
                    switcher: 'HTML',
                    popup: {
                        block: 'block-source',
                        content: getHtml()
                    }
                },
                {
                    block: 'dropdown',
                    mods: { switcher : 'link', theme : 'islands', size : 'm' },
                    switcher: 'BEMJSON',
                    popup: {
                        block: 'block-source',
                        content: getBemjson()
                    }
                },
                getDeps() ? {
                    block: 'dropdown',
                    mods: { switcher : 'link', theme : 'islands', size : 'm' },
                    switcher: 'deps',
                    popup: {
                        block: 'block-source',
                        content: getDeps()
                    }
                } : ''
            ]
        },
        {
            elem: 'preview',
            url: htmlUrl
        }
    ];
});
