modules.define('block-tabs', ['i-bem-dom', 'jquery'], function(provide, bemDom, $) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var _this = this,
                    tabs = this._elems('tab');

                this._urls = tabs.map(function(ancor) {
                    return ancor.domElem.attr('href').split('#').pop();
                });

                this.setCurrentTab();

                this._domEvents('tab').on('click', function(e) {
                    // var ancor = $(e.target);
                    // e.preventDefault();
                    // window.history.pushState({}, ancor.text(), ancor.attr('href'));

                    var index = -1;
                    for (var i = 0, len = tabs.size(); i < len; i++) {
                        if (tabs.get(i) === e.bemTarget) {
                            index = i;
                            break;
                        }
                    }

                    _this.updateTab(index);
                });
            }
        }
    },
    setCurrentTab: function() {
        var hash = window.location.hash.substr(1).split('-')[0];

        if (!hash) return;

        this.updateTab(this._urls.indexOf(hash));
    },
    updateTab: function(tabIdx) {
        if (tabIdx < 0) return;

        this._elems('tab')
            .delMod('current')
            .get(tabIdx).setMod('current');

        this._elems('pane')
            .delMod('active')
            .get(tabIdx).setMod('active');
    }
}));

});
