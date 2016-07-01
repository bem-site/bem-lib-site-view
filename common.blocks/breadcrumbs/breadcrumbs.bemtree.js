block('breadcrumbs').content()(function() {
    var lib = this.data.lib;

    return {
        elem: 'item',
        elemMods: { level: 1 },
        content: lib.name + (lib.version ? ('@' + lib.version) : '')
    };
});
