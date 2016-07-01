block('tabs')(
    js()(true),
    elem('tab').content()(function() {
        return {
            elem: 'ancor',
            url: this.ctx.url,
            content: applyNext()
        };
    }),
    elem('ancor')(
        tag()('span'),
        match(function() { return this.ctx.url; })(
            tag()('a'),
            attrs()(function() {
                return { href: this.ctx.url };
            })
        )
    )
);
