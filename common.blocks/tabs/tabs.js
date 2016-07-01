modules.define('tabs', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var _this = this,
                    ancors = this.elem('ancor');

                this._urls = [];

                ancors.each(function() {
                    _this._urls.push($(this).attr('href').split('#').pop());
                });

                this.setCurrentTab();

                this.bindTo(ancors, 'click', function(e) {
                    // var ancor = $(e.target);
                    // e.preventDefault();
                    // window.history.pushState({}, ancor.text(), ancor.attr('href'));

                    this.updateTab(ancors.index(e.target));
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

        var tabs = this.elem('tab'),
            panes = this.elem('pane');

        this
            .delMod(tabs, 'current')
            .setMod(tabs.eq(tabIdx), 'current')
            .delMod(panes, 'active')
            .setMod(panes.eq(tabIdx), 'active');
    }
}));

});
