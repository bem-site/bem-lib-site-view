block('main').content()(function() {
    return [
        {
            elem: 'sidebar',
            content: {
                block: 'block-list',
                content: this.data.blockList
            }
        },
        {
            elem: 'content',
            content:  {
                block: 'block-info',
                data: this.data
            }
        }
    ];
});
