const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const NodemonPlugin = require( 'nodemon-webpack-plugin' );
const nodeExternals = require('webpack-node-externals');

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    target: "node",
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        mainFields: ['main', 'module'],
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            "@config/*": path.join(__dirname,"src/config"),
            "@database/*": path.join(__dirname,"src/database"),
            "@domain/*": path.join(__dirname,"src/domain"),
            "@logs/*": path.join(__dirname,"src/logs"),
            "@utils/*": path.join(__dirname,"src/utils"),
            "@cache/*": path.join(__dirname,"src/cache"),
            "@graphQL/*": path.join(__dirname,"src/server/graphQL"),
            "@errors/*": path.join(__dirname,"src/server/errors"),
            "typegql": path.join(__dirname,"src/libs/typegql"),
            "ntypegql": path.join(__dirname,"src/libs/ntypegql")
        }
    },
    externals: [ nodeExternals(), 'pg', 'sqlite3', 'tedious', 'pg-hstore'],
    plugins: [
        //new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new Dotenv(),
        new NodemonPlugin()
    ],
    devServer: {
        contentBase: './dist'
    },
    optimization: {

    },
    stats: {
        warnings: false
    }
}

module.exports = config;