block('block-list').content()(function() {
    var data = this.data,
        page = data.page,
        currentPage = page.url;

    return (page.setsList || data.setsList).map(function(set) {
        return [
            {
                elem: 'set-name',
                content: set.name
            },
            {
                elem: 'set-list',
                content: {
                    elem: 'blocks',
                    content: set.blocks.map(function(blockName) {
                        var blockUrl = set.name + '/' + blockName + '/',
                            isCurrent = currentPage.lastIndexOf(blockUrl) !== -1,
                            libRoot = page.libRoot;

                        return {
                            elem: 'block',
                            elemMods: { current: isCurrent },
                            content: isCurrent ? blockName : {
                                block: 'link',
                                mix: { block: 'block-list', elem: 'link' },
                                url: (libRoot !== undefined ? libRoot : '../../') + blockUrl,
                                content: blockName
                            }
                        };
                    })
                }
            }
        ];
    });
});
