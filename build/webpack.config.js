var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080/',
        './main.js'
    ],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: './index.js'
    },
    context: path.resolve(__dirname, '../'),
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins : ["transform-class-properties", "transform-decorators-legacy"]

                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    stats: {
        colors: true
    },
    mode: 'development',
    devtool: 'source-map'
};