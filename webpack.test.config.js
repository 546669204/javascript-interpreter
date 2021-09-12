// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    merge
} = require("webpack-merge")
const base = require("./webpack.config")
const config = {
    entry: {
        test: './src/test-h5.ts',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: "test.html",
            chunks: ["test"]
        }),
    ],
    module: {
        rules: [{
            test: /test262/i,
            type: 'asset/source',
        }],
    },
};

module.exports = merge(base(), config);