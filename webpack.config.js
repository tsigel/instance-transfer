module.exports = {
    entry: './src/index.ts',
    output: {
        path: __dirname + '/dist',
        library: "instanceTransfer",
        publicPath: '/',
        libraryTarget: 'umd',
        filename: 'instance-transfer.min.js',
        globalObject: 'this'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
};