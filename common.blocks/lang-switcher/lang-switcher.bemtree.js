block('lang-switcher').content()(function() {
    var data = this.data,
        langs = data.langs;

    return {
        block: 'select',
        mods: { mode: 'radio', theme: 'islands', size: 'm' },
        name: 'lang',
        val: data.lang,
        options: langs.map(function(lang) {
            return { val: lang, text: lang.toUpperCase() };
        })
    };
});
