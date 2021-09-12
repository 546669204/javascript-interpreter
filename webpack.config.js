// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack")
const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: {
        main: './src/main.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        library:"jsInterpreter",// 在全局变量中增加一个library变量
        libraryTarget:"umd"
    },
    devServer: {
        open: false,
        historyApiFallback: true,
        host: '0.0.0.0',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: "main.html",
            chunks: ["main"]
        }),
        new webpack.DefinePlugin({
            'process.env.BABEL_TYPES_8_BREAKING': JSON.stringify(true)
        }),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [{
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            }, {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            "@": path.resolve(__dirname, 'src/'),
        },
        fallback: {
            "path": false,
            "buffer": false,
            "Buffer": false,
            "assert": false,
            "fs": false,
            "process": false,
        }
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';


    } else {
        config.mode = 'development';
    }
    return config;
};