const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: '[name].[contenthash:8].css' })]
        : []),
    ],
    optimization: isProd
      ? {
          minimizer: ['...', new CssMinimizerPlugin()],
        }
      : {},
    devServer: {
      port: 3000,
      open: true,
      historyApiFallback: true,
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
};
