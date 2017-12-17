modules.define('lang-switcher', ['i-bem-dom', 'select'], function(provide, bemDom, Select) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                this._events(Select).on('change', function(e) {
                    var select = e.bemTarget,
                        location = window.location;

                    location.href = location.href.replace('/' + this.params.lang + '/', '/' + select.getVal() + '/');
                });
            }
        }
    }
}));

});
