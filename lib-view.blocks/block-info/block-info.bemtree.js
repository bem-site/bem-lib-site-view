block('block-info').content()(function() {
    var data = this.ctx.data;

    if (!data.blockName) {
        return {
            block: 'block-doc',
            content: data.content,
            data: data
        };
    }

    var jsdoc = data.jsdoc,
        hasDocs = data.content[data.lang],
        hasJsdoc = jsdoc && (typeof jsdoc === 'string' ||
            (Array.isArray(jsdoc) && jsdoc.length && Object.keys(jsdoc[0].data).length) ||
            jsdoc.methods && jsdoc.methods.length),
        hasExamples = data.examples && data.examples.length,
        hasSources = data.blockSources;

    return {
        block: 'block-tabs',
        content: [
            hasDocs ? {
                elem: 'tab',
                elemMods: { current: true },
                url: '#docs',
                content: 'Documentation'
            } : '',
            hasJsdoc ? {
                elem: 'tab',
                elemMods: { current: !hasDocs },
                url: '#jsdoc',
                content: 'JSDoc'
            } : '',
            hasExamples ? {
                elem: 'tab',
                elemMods: { current: !hasDocs && !hasJsdoc },
                url: '#examples',
                content: 'Examples'
            } : '',
            hasSources ? {
                elem: 'tab',
                elemMods: { current: !hasDocs && !hasJsdoc && !hasExamples },
                url: '#source',
                content: 'Source'
            } : '',
            hasDocs ? {
                elem: 'pane',
                elemMods: { active: true },
                content: {
                    block: 'block-doc',
                    content: data.content[data.lang],
                    data: data
                }
            } : '',
            hasJsdoc ? {
                elem: 'pane',
                elemMods: { active: !hasDocs },
                content: {
                    block: 'block-jsdoc',
                    mods: { engine: jsdoc.methods ? 'jsdoc3' : 'jsd' },
                    jsdoc: jsdoc
                }
            } : '',
            hasExamples ? {
                elem: 'pane',
                elemMods: { active: !hasDocs && !hasJsdoc },
                content: data.examples.map(function(example) {
                    return {
                        block: 'block-example',
                        url: example.path,
                        data: data
                    };
                })
            } : '',
            hasSources ? {
                elem: 'pane',
                elemMods: { active: !hasDocs && !hasJsdoc && !hasExamples },
                // TODO: FIXME
                content: data.blockSources.filter(function(file) {
                    return !file.isDir;
                })
                .map(function(file) {
                    var filePath = file.path;

                    return {
                        tag: 'li',
                        content: filePath.indexOf('http') > -1 ? {
                            block: 'link',
                            url: filePath,
                            content: filePath
                        } : filePath
                    };
                })
            } : ''
        ]
    }
});
