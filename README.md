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
