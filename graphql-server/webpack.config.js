const path = require('path')
const webpack = require('webpack');

module.exports = env => {
  return {
    entry: {
      local: './index.local.js',
      lambda: './index.js',
    },
    mode: env.NODE_ENV === 'production' ? 'production' : "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {node: '8'}
                  }
                ]
              ]
            }
          },
          exclude: /node_modules/
        }
      ]
    },
    target: 'node',
    output: {
      filename: '[name]/index.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs'
    }
  };
};