var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: [
        path.join(__dirname, 'src/app.ts')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'game.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            protobufjs: path.join(__dirname, 'node_modules/protobufjs/dist/protobuf.js'),
            pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
            phaser: path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
            p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
            assets: path.join(__dirname, 'assets/')
        }
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: ['npm run assets:dev']
        }),
        new webpack.DefinePlugin({
            'DEBUG': true,

            // Do not modify these manually, you may break things...
            'DEFAULT_GAME_WIDTH': /*[[DEFAULT_GAME_WIDTH*/1920/*DEFAULT_GAME_WIDTH]]*/,
            'DEFAULT_GAME_HEIGHT': /*[[DEFAULT_GAME_HEIGHT*/1080/*DEFAULT_GAME_HEIGHT]]*/,
            'MAX_GAME_WIDTH': /*[[MAX_GAME_WIDTH*/1920/*MAX_GAME_WIDTH]]*/,
            'MAX_GAME_HEIGHT': /*[[MAX_GAME_HEIGHT*/1080/*MAX_GAME_HEIGHT]]*/,
            'SOCKETIO_URL': JSON.stringify('ws://localhost/ws'),
            // The items below most likely the ones you should be modifying
            'GOOGLE_WEB_FONTS': JSON.stringify([ // Add or remove entries in this array to change which fonts are loaded
                'Roboto Mono'
            ]),
            'SOUND_EXTENSIONS_PREFERENCE': JSON.stringify([ // Re-order the items in this array to change the desired order of checking your audio sources (do not add/remove/modify the entries themselves)
                'webm', 'ogg', 'm4a', 'mp3', 'aac', 'ac3', 'caf', 'flac', 'mp4', 'wav'
            ])
        }),
        new CleanWebpackPlugin([
            path.join(__dirname, 'dist')
        ]),
        new HtmlWebpackPlugin({
            title: 'DEV MODE: Glor.IO',
            template: path.join(__dirname, 'templates/index.ejs')
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
            ignored: /node_modules/
        }
    },
    module: {
        noParse: [
            /phaser-ce/
        ],
        rules: [
            { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
            { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
            { test: /\.ts$/, loader: 'ts-loader' }
        ],
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};