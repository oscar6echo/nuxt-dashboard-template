import fs from 'fs';

if (!process.env.DUMP) process.env.DUMP = 'false';
if (!process.env.MODE) process.env.MODE = 'DEV';
if (!process.env.CSS) process.env.CSS = 'vuetify';

if (!['GHP', 'SF', 'SF-LOCAL', 'DIR-LOCAL', 'DEV'].includes(process.env.MODE)) {
  // eslint-disable-next-line no-throw-literal
  throw 'MODE must be:\n\nGHP / Github Pages\nSF / Single File\nDIR-LOCAL / Directory Local\nSF-LOCAL / Single File Local\nDEV / development';
}

if (!['bootstrap', 'vuetify'].includes(process.env.CSS)) {
  // eslint-disable-next-line no-throw-literal
  throw 'CSS must be:\n\nbootstrap\nvuetify';
}

// GITHUB PARAMS
const GH_USERNAME = 'oscar6echo';
const GH_REPO = 'nuxt-dashboard-template';

// LOCAL PARAMS
const LOCAL_CDN_PORT = 5000;
const SF_LOCAL_CDN_PORT = 8080;
const DIR_LOCAL_CDN_PORT = 5000;

// SINGLE FILE HOSTING SERVICE PARAMS
const SF_SHORTNAME = 'my-dashboard';
const SF_SERVICE = 'https://my-prod-hostname';
const SF_PREFIX = 'my-prefix-';

// NUXT CONFIG PARAMS
const PUBLIC_PATH =
  process.env.MODE === 'GHP'
    ? '/' + GH_REPO + '/_nuxt/'
    : process.env.MODE === 'DIR-LOCAL'
    ? '/_nuxt/'
    : process.env.MODE === 'SF-LOCAL'
    ? './'
    : process.env.MODE === 'SF'
    ? './'
    : process.env.MODE === 'DEV'
    ? null
    : 'IMPOSSIBLE';

const ROUTER_BASE =
  process.env.MODE === 'GHP'
    ? '/' + GH_REPO + '/'
    : process.env.MODE === 'SF'
    ? '/' + SF_SHORTNAME + '/'
    : process.env.MODE === 'DIR-LOCAL'
    ? '/'
    : process.env.MODE === 'SF-LOCAL'
    ? '/'
    : process.env.MODE === 'DEV'
    ? '/'
    : 'IMPOSSIBLE';

const FILE_NAME =
  process.env.MODE === 'GHP'
    ? null
    : process.env.MODE === 'SF'
    ? '[name].js'
    : process.env.MODE === 'SF-LOCAL'
    ? '[name].js'
    : process.env.MODE === 'DIR-LOCAL'
    ? '[name].js'
    : process.env.MODE === 'DEV'
    ? null
    : 'IMPOSSIBLE';

const ROUTER_MODE =
  process.env.MODE === 'GHP'
    ? 'history'
    : process.env.MODE === 'SF'
    ? 'hash'
    : process.env.MODE === 'SF-LOCAL'
    ? 'hash'
    : process.env.MODE === 'DIR-LOCAL'
    ? 'history'
    : process.env.MODE === 'DEV'
    ? 'history'
    : 'IMPOSSIBLE';

// CHANGE TO INSPECT NUXT ROUTER
const ROUTER_DEBUG =
  process.env.MODE === 'GHP'
    ? false
    : process.env.MODE === 'SF'
    ? false
    : process.env.MODE === 'SF-LOCAL'
    ? false
    : process.env.MODE === 'DIR-LOCAL'
    ? false
    : process.env.MODE === 'DEV'
    ? false
    : 'IMPOSSIBLE';

const SPLITCHUNKS =
  process.env.MODE === 'SF' ||
  process.env.MODE === 'SF-LOCAL' ||
  process.env.MODE === 'DIR-LOCAL'
    ? {
        pages: false,
        vendor: true,
        commons: true,
        runtime: false,
        layouts: false
      }
    : {};

const CONSOLE_LOG =
  process.env.MODE === 'GHP'
    ? false
    : process.env.MODE === 'SF'
    ? false
    : process.env.MODE === 'SF-LOCAL'
    ? true
    : process.env.MODE === 'DIR-LOCAL'
    ? true
    : process.env.MODE === 'DEV'
    ? true
    : 'IMPOSSIBLE';

const ENV =
  process.env.MODE === 'DEV'
    ? { CDN_LOCAL: true, CDN_PORT: LOCAL_CDN_PORT }
    : process.env.MODE === 'SF-LOCAL'
    ? { CDN_LOCAL: true, CDN_PORT: SF_LOCAL_CDN_PORT }
    : process.env.MODE === 'DIR-LOCAL'
    ? { CDN_LOCAL: true, CDN_PORT: DIR_LOCAL_CDN_PORT }
    : process.env.MODE === 'SF'
    ? { CDN_LOCAL: false, CDN_HOSTNAME: SF_SERVICE, CDN_PREFIX: SF_PREFIX }
    : process.env.MODE === 'GHP'
    ? {
        CDN_LOCAL: false,
        CDN_HOSTNAME: 'https://' + GH_USERNAME + '.github.io/' + GH_REPO,
        CDN_PREFIX: 'cdn/'
      }
    : 'IMPOSSIBLE';

ENV.CONSOLE_LOG = CONSOLE_LOG;

let MODULES = [
  '@nuxtjs/apollo',
  '@nuxtjs/axios',
  '@nuxtjs/style-resources',
  'nuxt-svg-loader',
  [
    'nuxt-fontawesome',
    {
      component: 'fa',
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          // select icons from https://fontawesome.com/icons?d=gallery
          icons: [
            'faPlay',
            'faPause',
            'faStop',
            'faChevronUp',
            'faChevronDown',
            'faArrowRight',
            'faArrowLeft',
            'faExchangeAlt',
            'faRedo',
            'faUndo',
            'faStepForward',
            'faStepBackward'
          ]
        }
        // {
        //   set: '@fortawesome/free-solid-svg-icons',
        //   icons: ['fas']
        // },
        // {
        //   set: '@fortawesome/free-regular-svg-icons',
        //   icons: ['far']
        // },
        // {
        //   set: '@fortawesome/free-brands-svg-icons',
        //   icons: ['fab']
        // }
      ]
    }
  ]
];
if (process.env.CSS === 'bootstrap')
  MODULES = MODULES.concat(['bootstrap-vue/nuxt']);

let BUILD_MODULES = ['@nuxtjs/eslint-module'];
if (process.env.CSS === 'vuetify')
  BUILD_MODULES = BUILD_MODULES.concat(['@nuxtjs/vuetify']);

const TERSER = process.env.MODE === 'DEV' ? false : undefined;

console.log('\n---------- CONFIG');
console.log('process.env.NODE_ENV =', process.env.NODE_ENV);
console.log('process.env.CSS =', process.env.CSS);
console.log('process.env.MODE =', process.env.MODE);
console.log('process.env.DUMP =', process.env.DUMP);
console.log('ROUTER_BASE =', ROUTER_BASE);
console.log('PUBLIC_PATH =', PUBLIC_PATH);
console.log('FILE_NAME =', FILE_NAME);
console.log('SPLITCHUNKS =', SPLITCHUNKS);
console.log('ROUTER_MODE =', ROUTER_MODE);
console.log('ROUTER_DEBUG =', ROUTER_DEBUG);
console.log('ENV =', ENV);
console.log('MODULES =', MODULES);
console.log('BUILD_MODULES =', BUILD_MODULES);
console.log('TERSER =', TERSER);
console.log('---------- END CONFIG\n');

const nuxtConfig = {
  mode: 'spa',
  server: {
    port: 3000,
    host: 'localhost'
  },
  loadingIndicator: {
    name: '~/assets/logo/nuxt-spinner.html'
  },
  router: {
    base: ROUTER_BASE,
    mode: ROUTER_MODE
    // extendRoutes(routes, resolve) {
    //   routes.push({
    //     name: 'default',
    //     path: '*',
    //     component: resolve(__dirname, 'pages/index.vue')
    //   });
    // }
  },
  head: {
    title: 'Demo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Sample Nuxt Dashboard'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: ROUTER_BASE + 'favicon.ico'
      }
    ],
    script: []
  },
  css: [
    '@/node_modules/@ag-grid-community/all-modules/dist/styles/ag-grid.css',
    '@node_modules/@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css',
    '@node_modules/katex/dist/katex.min.css'
  ],
  plugins: [
    '~/plugins/axios/config.js',
    '~/plugins/ag-grid/config.js',
    '~/plugins/highcharts/config.js'
  ],
  buildModules: BUILD_MODULES,
  modules: MODULES,
  axios: {},
  apollo: {
    includeNodeModules: false,
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network'
      }
    },
    // required
    clientConfigs: {
      default: '~/plugins/apollo/client-config-default.js'
    },
    // optional
    errorHandler: '~/plugins/apollo/error-handler.js'
  },
  styleResources: {
    scss: ['assets/scss/colors.scss', 'assets/scss/dashboard.scss']
  },
  env: ENV,
  vuetify: {
    customVariables: ['~/assets/scss/vuetify-custom.scss'],
    treeShake: false, // BUG: true does not work - vuetify loader issue
    theme: {
      dark: false
    }
  },
  build: {
    // speeddup build
    // WARNING: parallel is incompatible with vue components with script tag without inline js
    // cache: true,
    // hardSource: true,
    // parallel: true,

    splitChunks: SPLITCHUNKS,
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'async'
      }
    },
    terser: TERSER,
    // EXTEND WEBPACK CONFIG
    extend(config, ctx) {
      if (process.env.MODE === 'DEV') {
        config.devtool = ctx.isClient ? 'source-map' : '';
      }

      // Web Worker support
      if (ctx.isClient) {
        config.module.rules.push({
          // test: /Loader\.worker\.js$/,
          test: /.*\.worker\.js$/,
          use: { loader: 'worker-loader' },
          exclude: /(node_modules)/
        });
      }
      config.resolve.alias.vue = 'vue/dist/vue.common';

      if (FILE_NAME) {
        config.output.filename = FILE_NAME;
        config.output.chunkFilename = FILE_NAME;
      }

      config.performance.maxEntrypointSize = 1e6;
      config.performance.maxAssetSize = 1e6;

      if (PUBLIC_PATH) config.output.publicPath = PUBLIC_PATH;

      if (process.env.DUMP === 'true') {
        const filename = 'nuxt-webpack-config-dump.json';
        const content = JSON.stringify(config, null, 2);
        fs.writeFile(filename, content, (err) => {
          if (err) {
            console.log(err);
          }
        });
        // eslint-disable-next-line no-throw-literal
        throw `Nuxt Webpack config dumped to ${filename}`;
      }
    }
  }
};

// MANUAL ROUTER - TO DEBUG
if (ROUTER_DEBUG) {
  nuxtConfig.buildModules.push('@nuxtjs/router');
  nuxtConfig.routerModule = {
    keepDefaultRouter: true,
    fileName: 'router-debug.js'
  };
}

export default nuxtConfig;
