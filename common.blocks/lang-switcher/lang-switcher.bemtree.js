block('lang-switcher').content()(function() {
    var data = this.data,
        langs = data.langs,
        currentLang = data.currentLang;

    return {
        block: 'select',
        mods: { mode: 'radio', theme: 'islands', size: 'm' },
        name: 'lang',
        val: currentLang,
        options: langs.map(function(lang) {
            return { val: lang, text: lang.toUpperCase() };
        })
    };
});
