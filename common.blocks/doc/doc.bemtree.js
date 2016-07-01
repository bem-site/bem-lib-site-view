block('doc').content()(function() {
    return applyNext().split(/<!-- bem-example: (.*?) -->/)
        .map(function(chunk, idx) {
            if (!(idx % 2)) return chunk;

            return {
                block: 'example',
                url: chunk
            };
        });
});
