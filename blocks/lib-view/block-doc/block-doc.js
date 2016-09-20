modules.define('block-doc', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl(this.name, {
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
