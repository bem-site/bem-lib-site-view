modules.define('block-example', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                var _this = this,
                    $iframe = this._elem('preview').domElem,
                    iframe = $iframe[0];


                // TODO: try to get rid from one of the calls
                this.updateIframeHeight(iframe);

                $iframe.on('load', function() {
                    _this.updateIframeHeight(iframe);
                });
            }
        }
    },
    updateIframeHeight: function(iframeDomEl) {
        iframeDomEl.style.height = iframeDomEl.contentWindow.document.body.clientHeight + 'px';
    }
}));

});
