block('block-list').content()(function() {
    var data = this.ctx.data,
        currentPage = data.page.url;

    return data.setsNames.map(function(set) {
        return [
            {
                elem: 'set-name',
                content: set
            },
            {
                elem: 'set-list',
                content: {
                    elem: 'blocks',
                    content: data.sets[set].map(function(block) {
                        var blockName = block.blockName,
                            blockUrl = set + '/' + blockName + '/',
                            pageUrl = data.page.rootUrl + blockUrl,
                            isCurrent = pageUrl === currentPage;

                        return {
                            elem: 'block',
                            elemMods: { current: isCurrent },
                            content: isCurrent ? blockName : {
                                block: 'link',
                                mix: { block: 'block-list', elem: 'link' },
                                url: (data.setPath !== undefined ? data.setPath : '../../') + blockUrl,
                                content: blockName
                            }
                        };
                    })
                }
            }
        ];
    });
});
