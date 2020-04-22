const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const paths = require('./paths');

module.exports = {
    mode: 'production',
    output: {
        filename: 'js/[name].[hash].js',
        path: paths.outputPath,
        chunkFilename: '[name].[chunkhash].js',
        publicPath: '/'
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin({
                terserOptions: {
                  parse: {
                    ecma: 8
                  },
                  compress: {
                    ecma: 5,
                    warnings : false,
                    comparisons: false,
                    inline: 2
                  },
                  mangle: {
                    safari10: true
                  },
                  output: {
                    ecma      : 5,
                    comments  : false,
                    ascii_only: true
                  }
                },
                cache: true,
                parallel: true,
                sourceMap: true,
              }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
          }),
        new CleanWebpackPlugin(),
    ],
};
