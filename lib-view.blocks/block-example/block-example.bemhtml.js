block('block-example')(
    addJs()(true),
    elem('preview')(
        tag()('iframe'),
        addAttrs()(function() {
            return { src: this.ctx.url };
        })
    )
);
