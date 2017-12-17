modules.define('search', ['i-bem-dom', 'querystring', 'input'], function(provide, bemDom, qs, Input) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var _this = this,
                    searchQuery = qs.parse(window.location.search.substr(1)).q;

                this._input = this._elem('input').findChildBlock(Input);

                if (searchQuery) {
                    this._input.setVal(searchQuery);
                    this.setMod('opened');
                }

                this._domEvents('switcher').on('click', function() {
                    this.setMod('opened');
                });

                this._events(this._input).on({ modName: 'focused', modVal: '' }, function() {
                    this.getVal() || _this.delMod('opened');
                });
            }
        },
        opened: {
            'true': function() {
                this._input.setMod('focused');
            }
        }
    }
}));

});
