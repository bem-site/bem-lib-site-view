block('form')(
    tag()('form'),
    addAttrs()(function() {
        var ctx = this.ctx;

        return {
            action: ctx.action,
            method: ctx.method
        };
    })
);
