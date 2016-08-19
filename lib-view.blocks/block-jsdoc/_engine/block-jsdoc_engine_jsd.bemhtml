block('block-jsdoc').mod('engine', 'jsd')(
    elem('block-name').tag()('h1'),

    elem('augment-title').tag()('span'),

    elem('augment-name').tag()('span'),

    elem('toc-entity').content()(function() {
        return {
            block: 'link',
            url: this.ctx.url,
            content: applyNext()
        };
    }),
    elem('toc-link').tag()('a'),

    elem('class-title').tag()('span'),
    elem('class-name').tag()('span'),

    elem('methods-title').tag()('h2'),

    elem('anchor').tag()('a'),
    elem('method-name').tag()('span'),
    elem('params-list')(
        tag()('span'),

        content()(function() {
            var list = applyNext(),
                listLength = list.length;

            return ['(', list.map(function(item, idx) {
                return idx < listLength - 1 ? [item, ', '] : item;
            }), ')'];
        })
    ),
    elem('param').tag()('span'),
    elem('param').elemMod('optional', true).content()(function() {
        return '[' + applyNext() + ']';
    }),
    elem('method-returns').tag()('span'),
    elem('method-labels').tag()('span'),
    elem('method-label').tag()('span'),

    elem('param-title').tag()('span'),
    elem('param-description').tag()('span'),
    elem('param-desc-item').tag()('span'),

    elem('method-href')(
        tag()('span'),

        content()(function() {
            return {
                block: 'link',
                url: applyNext(),
                mix: { block: 'block-anchor' }
            };
        })
    )
);
