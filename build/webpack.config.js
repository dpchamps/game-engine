var path = require('path');
var webpack = require('webpack');
var PROD = (process.env.NODE_ENV === 'production');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var config = {
    entry: [
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

if(!PROD){
    config.entry.unshift( 'webpack-dev-server/client?http://localhost:8080/');
}else{
    config.entry = {
        'index' : './main.js',
        'index.min' : './main.js'
    };
    config.output.filename = '[name].js'
    config.optimization = {
        minimize : true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    }
}



module.exports = config;