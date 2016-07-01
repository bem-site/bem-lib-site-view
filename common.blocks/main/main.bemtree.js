block('main').content()(function() {
    return [
        {
            block: 'aside',
            content: this.data.blocks
        },
        {
            block: 'content'
        }
    ];
});
