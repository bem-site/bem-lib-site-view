block('block-doc').content()(function() {
    var path = require('path'),
        data = this.ctx.data;

    return applyNext().split(/<!-- bem-example: (.*?) -->/)
        .map(function(chunk, idx) {
            if (!(idx % 2)) return chunk;

            var exampleName = chunk.split('/').pop(),
                examplePath = path.resolve(data.outputLibFolder,
                    data.setName, data.blockName, exampleName);

            return {
                block: 'block-example',
                name: exampleName,
                path: examplePath,
                data: data
            };
        });
});
