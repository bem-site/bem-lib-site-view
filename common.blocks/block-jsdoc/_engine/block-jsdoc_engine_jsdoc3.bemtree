block('block-jsdoc').mod('engine', 'jsdoc3')(
    content()(function () {
        var jsdoc = this.ctx.jsdoc,
            methods = jsdoc.methods,
            events = jsdoc.events;

        // if we get html display it
        if (typeof jsdoc === 'string') return jsdoc;

        return [
            jsdoc.description ? { elem: 'block-desc', content: jsdoc.description } : '',
            { elem: 'toc', content: jsdoc },
            methods && methods.length ? { elem: 'methods', content: methods } : '',
            events && events.length ? { elem: 'methods', name: 'events', content: events } : ''
        ];
    }),

    elem('toc').content()(function () {
        var jsdoc = applyNext(),
            methods = jsdoc.methods,
            events = jsdoc.events,
            baseBlock = jsdoc.baseBlock,
            list = [];

        // sets unique index to overriden methods
        function setIndex (arr) {
            var keys = {};
            arr.forEach(function (item) {
                var key = item.name,
                    visitedKey = keys[key];

                visitedKey && (item.index = visitedKey);
                keys[key] = visitedKey ? visitedKey + 1 : 1;
            });
        }

        function getList (prop) {
            return [{
                elem: 'method-link',
                attrs: { href: '#' + prop.name + (prop.index ? '-' + prop.index : '') },
                content: [
                    prop.name,
                    { elem: 'params-list', content: prop.params }
                ]
            }, '<br>'];
        }

        function getBaseList (base) {
            return [{
                elem: 'method-link',
                attrs: { href: '../../' + base + '/jsdoc' },
                content: base
            }, '<br>'];
        }

        if (baseBlock && baseBlock.length) {
            list.push({
                elem: 'toc-section',
                content: [
                    { elem: 'toc-title', content: 'Наследуется от:' },
                    baseBlock.map(getBaseList)
                ]
            });
        }

        if (methods && methods.length) {
            setIndex(methods);
            list.push({
                elem: 'toc-section',
                content: [
                    { elem: 'toc-title', content: 'Методы:' },
                    methods.map(getList)
                ]
            });
        }

        if (events && events.length) {
            setIndex(events);
            list.push({
                elem: 'toc-section',
                content: [
                    { elem: 'toc-title', content: 'События:' },
                    events.map(getList)
                ]
            });
        }

        return list;
    }),

    elem('methods').content()(function () {
        return [
            {
                elem: 'methods-title',
                content: this.ctx.name === 'events' ? 'События' : 'Методы'
            },
            applyNext().map(function (method) {
                return {
                    elem: 'method',
                    content: method
                };
            })
        ];
    }),

    elem('method').content()(function () {
        var method = applyNext(),
            deprecated = method.deprecated,
            description = method.description,
            returns = method.returns ? method.returns.map(function (item) {
                return item.description;
            }).join(' ') : '',
            params = method.params;

        return [
            { elem: 'method-title', content: method },
            deprecated ? { elem: 'deprecated', mix: { elem: 'desc-section' }, content: deprecated } : '',
            description ? { elem: 'description', mix: { elem: 'desc-section' }, content: description } : '',
            returns.length ? { elem: 'returns', mix: { elem: 'desc-section' }, content: returns } : '',
            params && params.length ? { elem: 'params', mix: { elem: 'desc-section' }, content: params } : ''
        ];
    }),

    elem('method-title').content()(function () {
        var method = applyNext(),
            name = method.name,
            returns = method.returns && method.returns.length ? method.returns.map(function (item) {
                return item.types && item.types.join(', ');
            }).filter(Boolean).join(' ') : '';

        return [
            { elem: 'anchor', attrs: { name: name + (method.index ? '-' + method.index : '') } },
            { elem: 'method-name', content: name },
            { elem: 'params-list', content: method.params },
            returns ? { elem: 'method-returns', content: ': ' + returns } : '',
            { elem: 'method-labels', content: method }
        ];
    }),

    elem('params-list').content()(function () {
        return applyNext().map(function (item) {
            return {
                elem: 'param',
                elemMods: { optional: item.optional },
                content: item.name
            };
        });
    }),

    elem('method-labels').content()(function () {
        return applyNext().access === 'protected' && { elem: 'method-label', content: 'protected' };
    }),

    elem('deprecated').content()(function () {
        return [
            {
                elem: 'section-title',
                content: 'deprecated'
            },
            {
                elem: 'section-content',
                content: applyNext()
            }
        ];
    }),

    elem('description').content()(function () {
        return [
            {
                elem: 'section-title',
                content: 'description'
            },
            {
                elem: 'section-content',
                content: applyNext()
            }
        ];
    }),

    elem('returns').content()(function () {
        return [
            {
                elem: 'section-title',
                content: 'returns'
            },
            {
                elem: 'section-content',
                content: applyNext()
            }
        ];
    }),

    elem('params').content()(function () {
        return [
            {
                elem: 'section-title',
                content: 'params'
            },
            {
                elem: 'section-content',
                content: applyNext().map(function (param) {
                    return {
                        elem: 'row',
                        content: param
                    };
                })
            }
        ];
    }),

    elem('row').content()(function () {
        var param = applyNext();
        return [
            {
                elem: 'param-title',
                content: param.name
            },
            {
                elem: 'param-description',
                content: [
                    {
                        elem: 'param-type',
                        content: param.types.join(', ')
                    },
                    {
                        elem: 'param-desc-item',
                        content: param.description
                    }
                ]
            }
        ];
    })
);
