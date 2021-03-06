block('block-jsdoc').mod('engine', 'jsd')(
    content()(function() {
        var jsdoc = this.ctx.jsdoc;

        // if we get html display it
        if (typeof jsdoc === 'string') return jsdoc;

        var keys = {},
            toc = [],
            content = [],
            entitiesIndex = {}, // unique index of entity
            bemNaming = require('bem-naming');

        jsdoc.forEach(function(entity) {
            var modules = entity.data.modules,
                hasPublicMethods = false, // flag of public methods
                tocItemEntities = [],
                contentItemEntities = [],
                moduleEntity = entity.entity,
                entityName = bemNaming.stringify(moduleEntity),
                entityIndex;

            if (!modules) return;

            // set entity's unique index
            entitiesIndex[entityName] = entitiesIndex[entityName] || 1;
            entityIndex = entitiesIndex[entityName]++;

            modules.forEach(function(module) {
                if (!module.exports) return;

                var classes = module.classes,
                    exports = module.exports,
                    augments = exports.augments,
                    description = module.description,
                    protoMethods = exports.proto,
                    staticMethods = exports.static,
                    objProps = exports.props,
                    funcParams = exports.params,
                    entityHref = 'jsdoc-' + entityName + '-' + entityIndex;

                // entity's augments
                augments && contentItemEntities.push({ elem: 'augments-description', content: augments });

                // entity's description
                [module, exports].forEach(function(item) {
                    var description = item.description;
                    description && contentItemEntities.push({ elem: 'block-description', content: description });
                });

                // get all public methods
                function getPublicMethods (methods) {
                    return methods.filter(function(method) {
                        var val = method.val,
                            accessLevel = val && val.accessLevel;

                        return !(accessLevel && accessLevel === 'private');
                    });
                }

                function addToTocAndContent(methods, name) {
                    if (!methods.length) return;

                    var publicMethods = getPublicMethods(methods);
                    if (!publicMethods.length) return;
                    hasPublicMethods = true;

                    if (name === 'Constructor') {
                        tocItemEntities.push({ elem: 'toc-title', content: name });
                        contentItemEntities.push(
                            { elem: 'methods-title', content: name },
                            { elem: 'parameters', mix: { elem: 'desc-section' }, content: publicMethods }
                        );
                    } else if (name === 'Object Params') {
                        contentItemEntities.push({
                            elem: 'parameters',
                            mix: { elem: 'desc-section' },
                            content: publicMethods
                        });
                    } else {
                        tocItemEntities.push({ elem: 'toc-title', content: name });
                        publicMethods.forEach(function(method) {
                            var key = method.key || method.name;

                            // set unique index for methods and put link to toc
                            keys[key] = keys[key] || 1;
                            method.index = keys[key]++;

                            tocItemEntities.push({
                                elem: 'toc-link',
                                attrs: { href: '#jsdoc-' + key + '-' + method.index },
                                content: key
                            }, { html: '<br>' });
                        });
                        contentItemEntities.push({ elem: 'methods', content: publicMethods, title: name });
                    }
                    return publicMethods;
                }

                // if module has class get all methods from it
                if (classes) {
                    Object.keys(classes).forEach(function(key) {
                        var classKey = classes[key],
                            classProto = classKey.proto,
                            classStatic = classKey.static,
                            classProtoProps = classProto && classProto.props,
                            classStaticProps = classStatic && classStatic.props;

                        classProtoProps && addToTocAndContent(classProtoProps, 'Instance methods:');
                        classStaticProps && addToTocAndContent(classStaticProps, 'Static methods:');
                    });
                } else {
                    protoMethods && addToTocAndContent(protoMethods.props, 'Instance methods:');
                    staticMethods && addToTocAndContent(staticMethods.props, 'Static methods:');
                }

                // if module returns object
                if (objProps) {
                    var publicObjProps = getPublicMethods(objProps);
                    addToTocAndContent(publicObjProps, 'Object methods:');

                    publicObjProps.forEach(function(prop) {
                        var val = prop.val,
                            classKey = 'Class ' + prop.key,
                            proto = val.proto,
                            protoProps = proto && proto.props,
                            static = val.static,
                            staticProps = static && static.props,
                            members = val.members,
                            membersProps = members && members.props,
                            cons = val.cons,
                            consParams = cons && cons.params;

                        if (!val) return;

                        if (val.jsdocType === 'class') {
                            tocItemEntities.push({ elem: 'toc-title', content: classKey });
                            contentItemEntities.push({ elem: 'block-name', index: entityIndex, content: classKey });
                        }
                        proto &&  addToTocAndContent(protoProps, 'Instance methods:');
                        static &&  addToTocAndContent(staticProps, 'Static methods:');
                        members && addToTocAndContent(membersProps, 'Members');
                        cons && consParams && addToTocAndContent(consParams, 'Constructor');
                    });
                }

                // if module is a function
                if (funcParams) {
                    addToTocAndContent(funcParams, 'Object Params');
                    exports.returns &&
                        contentItemEntities.push({
                            elem: 'returns',
                            mix: { elem: 'desc-section' },
                            content: exports.returns
                        });
                }

                // if we have public methods or props or params
                if (hasPublicMethods || objProps || funcParams) {
                    tocItemEntities.unshift({
                        elem: 'toc-entity',
                        url: '#' + entityHref,
                        content: entityName
                    });
                    contentItemEntities.unshift(
                        { elem: 'anchor', attrs: { id: entityHref } },
                        { elem: 'block-name', isBem: exports.bem, index: entityIndex, content: moduleEntity }
                    );
                // if we haven't public methods, but have augments or description
                } else if (augments || description) {
                    contentItemEntities.unshift(
                        { elem: 'anchor', attrs: { id: entityHref } },
                        { elem: 'block-name', isBem: exports.bem, index: entityIndex, content: moduleEntity }
                    );
                }
            });

            tocItemEntities.length && toc.push({ elem: 'toc-item', content: tocItemEntities });
            contentItemEntities.length && content.push({ elem: 'content-item', content: contentItemEntities });
        });

        // if we have only one link on entity in toc - do not display toc
        if (toc.length === 1 && toc[0].content.length === 1) {
            return content;
        }

        return toc.concat(content);
    }),

    elem('block-name').content()(function() {
        var entity = applyNext(),
            entityIndex = this.ctx.index,

            bemNaming = require('bem-naming');

        var blockName = typeof entity !== 'object' ? entity : bemNaming.isBlock(entity) ?
                (this.ctx.isBem ? 'Block ' : 'Module ') + entity.block : bemNaming.stringify(entity);

        return [
            { elem: 'method-href', content: '#jsdoc-' + blockName.replace(/(Class|Block)\s/, '') + '-' + entityIndex },
            blockName
        ];
    }),

    elem('augments-description').content()(function() {
        var augment = applyNext().jsType;

        return [
            {
                elem: 'augment-title',
                content: 'Augments:'
            },
            {
                elem: 'augment-name',
                content: augment
            }
        ];
    }),

    elem('methods').content()(function() {
        return [
            {
                elem: 'methods-title',
                content: this.ctx.title
            },
            applyNext().map(function(method) {
                return {
                    elem: 'method',
                    content: method
                };
            })
        ];
    }),

    elem('method').content()(function() {
        var method = applyNext(),
            val = method.val,
            deprecated = val && val.deprecated,
            description = val && val.description,
            params = val && val.params;

        return [
            { elem: 'method-title', content: method },
            deprecated ? { elem: 'deprecated', mix: { elem: 'desc-section' }, content: deprecated.description } : '',
            description ? { elem: 'description', mix: { elem: 'desc-section' }, content: description } : '',
            params ? { elem: 'parameters', mix: { elem: 'desc-section' }, content: params } : ''
        ];
    }),

    elem('method-title').content()(function() {
        var method = applyNext(),
            key = method.key || method.name,
            val = method.val,
            keyIndex = key + '-' + method.index;

        if (!val) return;

        return [
            { elem: 'anchor', attrs: { id: 'jsdoc-' + keyIndex } },
            { elem: 'method-name', content: [
                { elem: 'method-href', content: '#jsdoc-' + keyIndex },
                key
            ] },
            { elem: 'params-list', content: val.params },
            { elem: 'method-returns', content: val.returns },
            { elem: 'method-labels', content: val }
        ];
    }),

    elem('params-list').content()(function() {
        return (applyNext() || []).map(function(item) {
            var param = {
                elem: 'param',
                content: item.name
            };

            param.elemMods = { optional: item.isOptional };

            return param;
        });
    }),

    elem('method-returns').content()(function() {
        var returns = applyNext();
        if (!returns) return;
        var jsType = returns.jsType;
        jsType = jsType.jsType || jsType;

        return ':' + (jsType === '*' ? 'Any' : jsType);
    }),

    elem('method-labels').content()(function() {
        var val = applyNext(),
            labels = [];

        val.accessLevel === 'protected' && labels.push('protected');
        val.isAbstract && labels.push('abstract');
        val.isOverridden && labels.push('override'); // TODO link to source code

        return labels.map(function(label) {
            return { elem: 'method-label', content: label };
        });
    }),

    elem('deprecated').content()(function() {
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

    elem('description').content()(function() {
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

    elem('returns').content()(function() {
        var returns = applyNext();
        return [
            {
                elem: 'section-title',
                content: 'returns'
            },
            {
                elem: 'section-content',
                content: [
                    { elem: 'param-type', content: returns },
                    returns.description ? { elem: 'method-returns-desc', content: returns.description } : ''
                ]
            }
        ];
    }),

    elem('augments').content()(function() {
        var returns = applyNext();
        return [
            {
                elem: 'section-title',
                content: 'augments'
            },
            {
                elem: 'section-content',
                content: { elem: 'param-type', content: returns }
            }
        ];
    }),

    elem('parameters').content()(function() {
        return [
            {
                elem: 'section-title',
                content: 'parameters'
            },
            {
                elem: 'section-content',
                content: applyNext().map(function(param) {
                    return {
                        elem: 'row',
                        content: param
                    };
                })
            }
        ];
    }),

    elem('row').content()(function() {
        var param = applyNext();
        return [
            {
                elem: 'param-title',
                content: param.name
            },
            {
                elem: 'param-description',
                content: [
                    param.jsType ? {
                        elem: 'param-type',
                        content: param.jsType
                    } : '',
                    param.description ? {
                        elem: 'param-desc-item',
                        content: param.description
                    } : ''
                ]
            }
        ];
    }),

    elem('param-type').content()(function() {
        var jsType = applyNext();

        if (!jsType) return;

        jsType = jsType.jsType || jsType;
        return Array.isArray(jsType) ? jsType.join(', ') : jsType;
    })
);
