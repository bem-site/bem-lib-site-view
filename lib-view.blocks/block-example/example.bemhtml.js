block('example')(
    js()(true),
    elem('preview')(
        tag()('iframe'),
        attrs()(function() {
            return { src: this.ctx.url };
        })
    )
);
