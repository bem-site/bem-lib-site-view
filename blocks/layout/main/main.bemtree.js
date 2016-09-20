block('main').content()(function() {
    return [
        {
            elem: 'sidebar',
            content: {
                block: 'block-list',
                data: this.data
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
