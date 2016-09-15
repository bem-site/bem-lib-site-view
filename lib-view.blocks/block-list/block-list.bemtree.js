block('block-list').content()(function() {
    var data = this.data,
        currentPage = data.page.url;

    return applyNext().map(function(page) {
        var isCurrent = data.page.rootUrl + page === currentPage;

        return {
            elem: 'item',
            elemMods: { current: isCurrent },
            content: isCurrent ? page : {
                block: 'link',
                mix: { block: 'block-list', elem: 'link' },
                url: (data.setPath ? data.setPath + '/' : '../') + page + '/',
                content: page
            }
        };
    });
});
