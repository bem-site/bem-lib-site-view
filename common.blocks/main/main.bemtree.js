block('main').content()(function() {
    return [
        {
            elem: 'sidebar',
            content: {
                block: 'block-list',
                content: this.data.blocks
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
