/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const {mergeWithCustomize, customizeObject} = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin')
const DotenvWebpack = require('dotenv-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

// use absolute paths to avoid build errors and other surprises
const path = require('path')
const rootPath = __dirname
const sourcePath = path.join(rootPath, './src')
const distPath = path.join(rootPath, './dist')
const staticPath = path.join(rootPath, './static')
const stylePath = path.join(rootPath, './style')
const libPath = path.join(rootPath, './node_modules')
const tsConfigPath = path.join(rootPath, './tsconfig.json')

// load vars for current config file
require('dotenv-safe').config({
  allowEmptyValues: false,
  example: path.join(rootPath, './.env.example'),
})

const isProd = process.env.NODE_ENV === 'production'

let combinedConfig = {}

// per key merging strategy
const mergeStrategy = {
  'entry.js': 'prepend',
}

const cssLoaderWithOptions = {
  loader: 'css-loader',
  options: {
    url: false,
  },
}

// config used as a base for both production and development
const baseConfig = {
  context: sourcePath,
  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
    static: {
      directory : staticPath,
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    client: {
      logging: process.env.DEV_CLIENT_LOG_LEVEL,
    },
    port: process.env.DEV_SERVER_PORT,
  },
  stats: {
    children: false,
    modules: false,
  },
  entry: {
    js: [
      path.join(libPath, 'react-dates/initialize.js'),
      path.join(libPath, 'react-dates/lib/css/_datepicker.css'),
      path.join(sourcePath, 'index.tsx'),
      path.join(stylePath, 'app.scss'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(html|ico|htaccess)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
          },
        },
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '/fonts/',
            },
          },
        ],
      },
    ],
  },
  output: {
    path: distPath,
    publicPath: '/',
    filename: 'bundle.[hash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BUILD_TIME': JSON.stringify(new Date()),
    }),
    new DotenvWebpack(),
    new HtmlWebpackPlugin({
      template: path.join(staticPath, 'index.ejs'),
      inject: 'body',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        enabled: false,
        files: '**/*.{ts,tsx}',
      },
      typescript: {
        configFile: tsConfigPath,
      },
    }),
    // downloads fonts directly from google fonts
    new GoogleFontsPlugin({
      fonts: [
        {
          family: 'Open Sans',
          variants: ['400', '700'],
        },
      ],
      formats: ['woff'],
      encode: true,
      cache: true,
      apiUrl: 'https://gwfh.mranftl.com/api/fonts',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
    modules: [sourcePath, 'node_modules'],
  },
}

// production specific settings
if (isProd) {
  const prodConfig = {
    devServer: {
      compress: true,
      hot: false,
    },
    entry: {
      // polyfill for older browsers
      js: ['@babel/polyfill'],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, cssLoaderWithOptions, 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, cssLoaderWithOptions],
        },
      ],
    },
    optimization: {
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
    performance: {
      maxAssetSize: 3e6,
      maxEntrypointSize: 3e6,
      hints: 'warning',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.[hash].css',
        chunkFilename: '[id].css',
      }),
      new CopyWebpackPlugin({patterns: [{from: staticPath, to: distPath, globOptions: {ignore: ['**/*.ejs']}}]}),
    ],
  }

  combinedConfig = mergeWithCustomize({customizeObject: customizeObject(mergeStrategy)})(baseConfig, prodConfig)
} else {
  // development specific settings
  const devConfig = {
    devServer: {
      compress: false,
      hot: true,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            'style-loader', // fallback to style-loader in development for hot reload
            cssLoaderWithOptions,
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', // fallback to style-loader in development for hot reload
            cssLoaderWithOptions,
          ],
        },
      ],
    },
    resolve: {
      alias: {
        // redirects the normal react-dom to the hotloader version for development
        'react-dom': '@hot-loader/react-dom',
      },
    },
  }

  combinedConfig = mergeWithCustomize({customizeObject: customizeObject(mergeStrategy)})(baseConfig, devConfig)
}

module.exports = combinedConfig
