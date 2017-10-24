# bem-lib-site-view

## Installation

Consider using `bem-lib-site-view` as a dependency of `bem-lib-site` package.

As separate module it can be installed with:
```
npm i bem-lib-site-view
```

## Usage

### Configuration

Use `bem-config` to set up `bem-lib-site-view`.

### Input data

`bem-lib-site-view` uses result of `bem-lib-site-data` work as an input.

Example of data generated for `lib-name@1.0.0`:

```
output-data/lib-name-1.0.0/
    data.json
    desktop.docs/
    desktop.examples/
    desktop.html/
    readme.md
```

The content of `data.json` file:
```json
{
    "library": "engino",
    "version": "0.2.2",
    "docs": {
        "readme": {
            "": "readme.md"
        }
    },
    "sets": {
        "desktop": {
            "ng-head": {
                "bemdecl.js": "desktop.docs/ng-head/ng-head.bemdecl.js",
                "data.json": "desktop.docs/ng-head/ng-head.data.json",
                "en.doc.html": "desktop.docs/ng-head/ng-head.en.doc.html",
                "en.md": "desktop.docs/ng-head/ng-head.en.md",
                "jsdoc.html": "desktop.docs/ng-head/ng-head.jsdoc.html",
                "jsdoc.json": "desktop.docs/ng-head/ng-head.jsdoc.json",
                "jsdoc.md": "desktop.docs/ng-head/ng-head.jsdoc.md",
                "meta.json": "desktop.docs/ng-head/ng-head.meta.json",
                "ru.doc.html": "desktop.docs/ng-head/ng-head.ru.doc.html",
                "ru.md": "desktop.docs/ng-head/ng-head.ru.md",
                "examples": {
                    "mCdOrjljgfwYY9yojev4_xUyHvc": [
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.bemdecl.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.bemhtml.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.bemjson.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.borschik.browser.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.browser.bemhtml.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.browser.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.css",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.deps.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.en.html",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.html",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.ie.css",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.js-js.bemdecl.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.js.bemdecl.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.js.deps.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.pre.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.ru.html",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.short.bemjson.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.template.bemdecl.js",
                        "desktop.examples/ng-head/mCdOrjljgfwYY9yojev4_xUyHvc/mCdOrjljgfwYY9yojev4_xUyHvc.template.deps.js"
                    ],
                    "Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM": [
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.bemdecl.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.bemhtml.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.bemjson.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.borschik.browser.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.browser.bemhtml.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.browser.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.css",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.deps.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.en.html",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.html",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.ie.css",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.js-js.bemdecl.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.js.bemdecl.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.js.deps.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.pre.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.ru.html",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.short.bemjson.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.template.bemdecl.js",
                        "desktop.examples/ng-head/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM/Xwy8-9Y6Lc2tEYfgRLS-Z-xtEcM.template.deps.js"
                    ]
                }
            }
        }
    }
}
```

### CLI

```
bem-lib-site-view path/to/data
```

### API

```js
require('.')('path/to/data', function() { console.log('done'); });
```

## Project structure

### Levels

* `common.blocks`
* `lib-view.blocks`
