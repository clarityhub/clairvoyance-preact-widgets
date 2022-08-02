const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
const publicPath = process.env.REACT_APP_WIDGETS_URL + '/';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// XXX Sass loader not working

module.exports = {
  context: paths.root,
  devtool: 'source-map',
  entry: paths.entries,
  output: {
    path: paths.output,
    pathinfo: true,
    publicPath: publicPath,
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx'],

    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      'create-react-class': 'preact-compat/lib/create-react-class',
    },
  },

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: require.resolve('style-loader'),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              sourceMap: true,
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              sourceMap: true,
              includePaths: [
                paths.appSrc,
                paths.designSrc,
              ],
            },
          },
        ],
      },

      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.sass$/,
          /\.scss$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          publicPath: publicPath,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },

      {
        test: /\.js$/,
        include: [
          paths.chatSrc,
          paths.regSrc,
          paths.themeSrc,
          paths.emailSrc
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'stage-2',
              'react',
            ],
          },
        },
      },
    ],
  },

  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: false,
      template: paths.appHtml,
      filename: 'chat/index.html',
    }),

    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },

  watch: process.env.WATCH ? true : false,
};
