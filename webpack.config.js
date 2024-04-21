const path = require('path');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'config': './src/js/config/index.jsx',
    'desktop': './src/js/desktop/index.js',
    'mobile': './src/js/mobile/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'plugin', 'js'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_module)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3
                }
              ],
              "@babel/preset-react"
            ]
          }
        }
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      }
    ]
  },
  devServer: {
    open: true,    
    static: {
      directory: path.join(__dirname, 'plugin'),      
    },
    compress: true
  },
  /* optimization: {
    runtimeChunk: 'single',
  }, */
  plugins: [
    new KintonePlugin({
      manifestJSONPath: './plugin/manifest.json',
      privateKeyPath: './dist/gfipknjibeaafgafbpemlmpbiojcoiap.ppk',
      pluginZipPath: (id, manifest) => `dist/plugin.${manifest.version}.zip`
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    })
  ],
  resolve: {
    extensions: ['.jsx', '.js']
  },
  externals: {
    "KintoneConfigHelper": 'KintoneConfigHelper'
  }
}