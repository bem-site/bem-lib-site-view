modules.define('lang-switcher', ['i-bem__dom', 'select'], function(provide, BEMDOM, Select) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                Select.on(this.domElem, 'change', function(e) {
                    var select = e.target,
                        location = window.location;

                    location.href = location.href.replace('/' + this.params.lang + '/', '/' + select.getVal() + '/');
                }, this);
            }
        }
    }
}));

});
