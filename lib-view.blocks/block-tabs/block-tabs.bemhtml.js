block('block-tabs')(
    addJs()(true),
    elem('tab')(
        tag()('span'),
        match(function() { return this.ctx.url; })(
            tag()('a'),
            addAttrs()(function() {
                return { href: this.ctx.url };
            })
        )
    )
);
