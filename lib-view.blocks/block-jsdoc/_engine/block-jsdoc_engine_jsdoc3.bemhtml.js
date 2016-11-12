block('block-jsdoc').mod('engine', 'jsdoc3')(

    elem('method-link').tag()('a'),

    elem('methods-title').tag()('h2'),

    elem('anchor').tag()('a'),
    elem('method-name').tag()('span'),

    elem('params-list')(
        tag()('span'),

        content()(function () {
            var list = applyNext(),
                listLength = list.length;

            return ['(', list.map(function (item, idx) {
                return idx < listLength - 1 ? [item, ', '] : item;
            }), ')'];
        })
    ),
    elem('param').tag()('span'),
    elem('param').elemMod('optional', true).content()(function () {
        return '[' + applyNext() + ']';
    }),
    elem('method-returns').tag()('span'),
    elem('method-labels').tag()('span'),
    elem('method-label').tag()('span'),

    elem('param-title').tag()('span'),
    elem('param-description').tag()('span'),
    elem('param-type').content()(function () {
        return this.xmlEscape(applyNext());
    }),
    elem('param-desc-item').tag()('span')
);
