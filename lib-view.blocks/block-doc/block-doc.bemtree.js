block('block-doc').content()(function() {
    var path = require('path'),
        data = this.ctx.data;

    return applyNext().split(/<!-- bem-example: (.*?) -->/)
        .map(function(chunk, idx) {
            if (!(idx % 2)) return chunk;

            var exampleName = chunk.split('/').pop(),
                examplePath = path.resolve(data.outputLibFolder,
                    data.setName, exampleName),
                pathToExample = chunk.replace('tmp/data', 'node_modules/bem.info-data'), // FIXME: упячка
                pathToHtml = path.resolve(pathToExample.replace(/\/(.*?)\.examples\//, '/$1.html/'));

            return {
                block: 'block-example',
                name: exampleName,
                pathToHtml: pathToHtml,
                inline: true,
                data: data
            };
        });
});
