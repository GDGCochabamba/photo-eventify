'use strict';

const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname + "/src",
  entry: {
    app: [
      "./main.ts",
      "./main.scss"
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      { // typescript
        test: /\.ts$/,
        use: [{
          loader: "ts-loader"
        }]
      },
      { // scss
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'sass-loader', 'import-glob-loader'])
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['assets', 'css'], {}),
    new HtmlWebpackPlugin ({
      inject: true,
      template: './index.html'
    }),
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      {from: './assets', to: './assets'}
    ])
  ]
};
