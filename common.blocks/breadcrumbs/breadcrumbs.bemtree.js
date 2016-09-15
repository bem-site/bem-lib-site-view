block('breadcrumbs').content()(function() {
    var data = this.data,
        page = data.page,
        content = data.library + (data.version ? ('@' + data.version) : '');

    return {
        elem: 'item',
        elemMods: { level: 1 },
        content: page.url === '/' ? content : {
            block: 'link',
            url: data.blockName ? '../../' : '../',
            content: content
        }
    };
});
