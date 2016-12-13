block('block-example').content()(function() {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        hljs = require('highlight.js'),
        beautify = require('js-beautify'),
        nodeEval = require('node-eval'),
        ctx = this.ctx,
        data = ctx.data,
        bundleName = ctx.name,
        pathToBundle = ctx.path,
        examplesUrlPrefix = data.examplesUrlPrefix || '../../..',
        htmlUrl = (ctx.inline ? examplesUrlPrefix + '/' + data.setName + '/' : '') + bundleName + '.html',
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
                return '(' + examples[i].source + ')';
            }
        }

        // standalone examples
        try {
            return fs.readFileSync(pathToBundle + '.bemjson.js', 'utf8');
        } catch(err) {
            var message = 'Error: No example file ' + pathToBundle + '.bemjson.js' + ' was found';

            console.error(err);
            console.error(message);
            return '{ content: "' + message + '" }'
        }
    }

    function getHtml() {
        var bemjson = {},
            html = '',
            bemhtml;

        try {
            bemjson = nodeEval(getBemjson());
        } catch(err) {
            console.log(err.stack);
        }

        // TODO: support BEMHTML optionally
        try {
            html = require(pathToBundle + '.bh.js').apply(bemjson);
        } catch(e) {
            // console.log('No example file', pathToBundle + '.bh.js', 'was found, falling back to BEMHTML...');
            try {
                html = require(pathToBundle + '.bemhtml.js').BEMHTML.apply(bemjson);
            } catch(e) {
                console.error(e);
                console.error('Error: Cannot apply templates', pathToBundle + '.bemhtml.js');
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
