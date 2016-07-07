block('doc').content()(function() {
    var path = require('path'),
        data = this.data,
        outputFolder = data.outputFolder,
        lib = data.lib.name;

    return applyNext().split(/<!-- bem-example: (.*?) -->/)
        .map(function(chunk, idx) {
            if (!(idx % 2)) return chunk;

            var exampleName = chunk.split('/').pop();

            return {
                block: 'example',
                url: path.resolve(outputFolder, lib, exampleName)
            };
        });
});
