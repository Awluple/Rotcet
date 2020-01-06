const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');


const cssExtract = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css',
})


module.exports = {
    output: {
      path: path.join(__dirname, '../RotcetDjango/static/frontend/'),
      filename: 'main.js',
      publicPath: '/static/'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            }
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader',
          ],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        },
      ]
    },
    plugins: [cssExtract, new CleanWebpackPlugin()]
}