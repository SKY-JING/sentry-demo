const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const SentryCliPlugin = require('@sentry/webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, dir);
}

// proxy
let proxyTarget = 'http://icore-cbm-dmzstg1.pingan.com.cn';
const proxyTargetMatch = process.env.npm_lifecycle_script.match('--proxyEnv=([^ ]*)');
if (proxyTargetMatch) {
  proxyTarget = proxyTargetMatch[1];
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '',
  lintOnSave: 'error',
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // gzip
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }));
    }
    // sentry
    const release = process.env.RELEASE_VERSION;
    config.plugins.push(new SentryCliPlugin({
      release,
      include: './dist',
      // ignoreFile: '.sentrycliignore',
      // urlPrefix: '~/sentry-demo/', // source-map路径
      ignore: ['node_modules', 'webpack.config.js']
      // configFile: 'sentry.properties',
    }));
    // dll
    config.plugins.push(new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require('./public/vendor/vendor-manifest.json')
    }));
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@public', resolve('public'))
      .set('@', resolve('src'))
      .set('&', resolve('src/assets'))
      .set('~', resolve('src/components'))
      .set('^', resolve('src/views'));

    // analyz
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [{
        analyzerMode: 'static'
      }]);
    }

    config.resolve.symlinks(true);
    config.plugins.delete('prefetch');
  },
  css: {
    extract: process.env.VUE_APP_CSS_EXTRACT,
    sourceMap: false,
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      },
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // eslint-disable-next-line
          hack: `true; @import '${path.join(__dirname, './src/assets/css/vant-reset.less')}';`
        }
      }
    }
  },
  devServer: {
    port: '9990',
    proxy: {
      '^/market': {
        target: `${proxyTarget}/market`,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/market': ''
        }
      }
    },
    overlay: {
      warning: true,
      errors: true
    }
  }
};
