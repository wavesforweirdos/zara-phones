const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Loads .env locally; on Vercel the variables come from the project settings
require('dotenv').config({ quiet: true });

const REQUIRED_ENV = ['API_BASE_URL', 'API_KEY'];

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}. See .env.example`);
  }

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              envName: isProd ? 'production' : 'development',
              cacheDirectory: !isProd,
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.svg$/,
          type: 'asset/resource',
        },
        {
          test: /\.scss$/,
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new DefinePlugin(
        Object.fromEntries(
          REQUIRED_ENV.map((name) => [`process.env.${name}`, JSON.stringify(process.env[name])])
        )
      ),
      ...(isProd ? [new MiniCssExtractPlugin({ filename: '[name].[contenthash:8].css' })] : []),
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
