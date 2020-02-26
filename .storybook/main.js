const path = require('path');
const webpack = require('webpack');

module.exports = {
  stories: ['./Welcome.story.jsx', '../**/*.story.jsx'],
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    'storybook-addon-rtl',
    'storybook-readme',
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // High quality 'original source' sourcemaps are slow to generate on initial builds and rebuilds.
    // Using cheap-module-eval-source-map speeds up builds and rebuilds in development while not sacrificing too much source map quality.
    config.devtool = configType === 'DEVELOPMENT' ? 'cheap-module-eval-source-map' : 'source-map';

    // Moment.js is quite large, the locales that they bundle in the core as of v2.18 are ignored to keep our bundle size down.
    // https://webpack.js.org/plugins/ignore-plugin/#example-of-ignoring-moment-locales
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment\/min$/));

    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: [/node_modules/, /coverage/],
      use: 'babel-loader',
    });

    // Remove the existing css rule
    // https://github.com/storybookjs/storybook/issues/6319#issuecomment-477852640
    config.module.rules = config.module.rules.filter(f => f.test.toString() !== '/\\.css$/');

    // Define our desired scss/css rule
    config.module.rules.push({
      test: /\.s?css$/,
      exclude: [/coverage/],
      use: [
        // Creates `style` nodes from JS strings
        { loader: 'style-loader' },
        // Translates CSS into CommonJS
        {
          loader: 'css-loader',
          options: { importLoaders: 2 },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [
              require('autoprefixer')({
                browsers: ['last 1 version', 'ie >= 11'],
              }),
            ],
          },
        },
        // Compiles Sass to CSS
        {
          loader: 'fast-sass-loader',
          options: {
            includePaths: [path.resolve(__dirname, '..', 'node_modules')],
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {},
        },
      ],
    });

    // Return the altered config
    return config;
  },
};
