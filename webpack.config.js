const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/src/index.js',

  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '/client/dist'),
      publicPath: '/',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        secure: false,
      },
      '/login': {
        target: 'http://localhost:3000/',
        secure: false,
      },
      '/signup': {
        target: 'http://localhost:3000/',
        secure: false,
      },
    },
    compress: true,
    historyApiFallback: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './client/src/index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};
