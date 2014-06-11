// Webpack Configuration
// http://webpack.github.io/docs/configuration.html

var webpack = require('webpack');

module.exports = function (isDebug) {
    return {
        output: {
            publicPatch: './build/',
            path: './build/',
            filename: 'app.js',
            hideModules: true
        },

        cache: isDebug,
        debug: isDebug,
        devtool: false,
        entry: './src/app.jsx',
        qiuet: true,

        stats: {
            colors: true,
            reasons: isDebug
        },

        plugins: isDebug ? [] : [
            new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        ],

        module: {
            preLoaders: [
                {
                    test: '\\.js$',
                    exclude: 'node_modules',
                    loader: 'jshint'
                }
            ],

            loaders: [
                {
                    test: /\.css$/,
                    loader: 'style!css'
                },
                {
                    test: /\.gif/,
                    loader: 'url-loader?limit=10000&minetype=image/gif'
                },
                {
                    test: /\.jpg/,
                    loader: 'url-loader?limit=10000&minetype=image/jpg'
                },
                {
                    test: /\.png/,
                    loader: 'url-loader?limit=10000&minetype=image/png'
                },
                {
                    test: /\.jsx$/,
                    loader: 'jsx-loader'
                }
            ]
        }
    };
};
