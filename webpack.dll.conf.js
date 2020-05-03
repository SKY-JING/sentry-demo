const path = require('path');
const webpack = require('webpack');

const dllPath = 'public/vendor';

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router', 'vuex', 'axios']
  },
  output: {
    path: path.join(__dirname, dllPath),
    filename: '[name].dll.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, '[name]-manifest.json'),
      name: '[name]_[hash]',
      context: process.cwd()
    })
  ]
};