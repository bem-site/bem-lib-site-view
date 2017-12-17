modules.define('block-doc', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                $('pre code', this.domElem).each(function(i, block) {
                    hljs.highlightBlock(block);
                });
            }
        }
    }
}));

});
