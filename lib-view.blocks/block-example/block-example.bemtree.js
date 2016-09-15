block('block-example').content()(function() {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        hljs = require('highlight.js'),
        beautify = require('js-beautify'),
        nodeEval = require('node-eval'),
        data = this.ctx.data,
        pageUrl = data.page.url,
        url = this.ctx.url,
        bundleName = url.split('/').pop(),
        // pathToBundle = path.resolve(url, bundleName),
        pathToBundle = url,
        // pathToBundle = ['..', '..', path.relative(pageUrl, data.rootUrl), bundleName].join('/'),
        // htmlUrl = bundleName + '/' + bundleName + '.html',
        // htmlUrl = data.rootUrl + bundleName + '.html',
        // htmlUrl = ['..', '..', path.relative(pageUrl, data.rootUrl), bundleName + '.html'].join('/'),
        htmlUrl = ['..', '..', path.relative(pageUrl, data.page.rootUrl), bundleName + '.html'].join('/'),
        // htmlUrl = pathToBundle + '.html',
        exampleSources = data.examplesSources && data.examplesSources[bundleName] || [];

    data.mode === 'server' && console.log(require('child_process').execSync(path.resolve('./node_modules/.bin/magic') + ' make ' + url, {
        cwd: path.resolve('.'),
        env: process.env
    }).toString());

    var entityDeps; // используется как кэш для getDeps()
    function getDeps() {
        if (entityDeps) return entityDeps;

        // TODO: возможно отказаться от разделения в make.js и делить в шаблонах?
        var allExamples = [].concat(data.inlineExamples || [], data.examples || []);

        // TODO: перебор отчасти дублирует getBemjson()
        for (var i = 0; i < allExamples.length; i++) {
            if (allExamples[i].name === bundleName) {
                return entityDeps = util.inspect(allExamples[i].entityDeps, { depth: null });
            };
        }
    }

    function getBemjson() {
        var examples = data.inlineExamples || [];

        for (var i = 0; i < examples.length; i++) {
            if (examples[i].name === bundleName) {
                return examples[i].source;
            };
        }

        // standalone examples
        return fs.readFileSync(pathToBundle + '.bemjson.js', 'utf8');
    }

    function getHtml() {
        var bemjson = {},
            html = '';

        try {
            bemjson = nodeEval('(' + getBemjson() + ')');
        } catch(err) {
            console.log('Error while evaluating', pathToBundle + '.bemjson.js');
            console.log(err);
        }
            // TODO: support BEMHTML optionally
            try {
                html = require(pathToBundle + '.bh.js').apply(bemjson);
            } catch(e) {
                // console.error(e);
                console.log('No example file', pathToBundle + '.bh.js', 'was found, falling back to BEMHTML...');
                try {
                    html = require(pathToBundle + '.bemhtml.js').BEMHTML.apply(bemjson);
                } catch (e) {
                    console.error('Error: No example file', pathToBundle + '.bemhtml.js', 'was found');
                    html = '<pre>' + e.stack + '</pre>'
                }
            }

        return {
            block: 'block-source',
            content: hljs.highlight('xml', beautify.html(html)).value
        };
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
                    popup: getHtml()
                },
                {
                    block: 'dropdown',
                    mods: { switcher : 'link', theme : 'islands', size : 'm' },
                    switcher: 'BEMJSON',
                    popup: {
                        block: 'block-source',
                        content: hljs.highlight('js', getBemjson()).value
                    }
                },
                getDeps() ? {
                    block: 'dropdown',
                    mods: { switcher : 'link', theme : 'islands', size : 'm' },
                    switcher: 'deps',
                    popup: {
                        block: 'block-source',
                        content: hljs.highlight('js', getDeps()).value
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
