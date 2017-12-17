block('logo')(
    tag()(function() {
        return this.ctx.url ? 'a' : 'span';
    }),
    addAttrs()(function() {
        return {
            href: this.ctx.url
        };
    })
);
