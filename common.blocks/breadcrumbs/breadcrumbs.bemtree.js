block('breadcrumbs').content()(function() {
    var data = this.data,
        page = data.page,
        content = data.libraryName;

    return {
        elem: 'item',
        elemMods: { level: 1 },
        content: page.url === '/' ? content : {
            block: 'link',
            mix: { block: 'breadcrumbs', elem: 'link' },
            url: data.blockName ? '../../' : '../',
            content: content
        }
    };
});
