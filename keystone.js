// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

const i18next = require('i18next')
const i18nExpressMiddleware = require('i18next-express-middleware')
const FilesystemBackend = require('i18next-sync-fs-backend')


// Require keystone
const keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

const MONGO_URI = process.env.MONGO_URI;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
const SSL_CA_PATH = process.env.SSL_CA_PATH;
const CLOUDINARY_CONFIG = process.env.CLOUDINARY_CONFIG;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

keystone.init({
  'name': 'Govolunteer',
  'brand': 'Govolunteer',

  'less': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'pug',

  'auto update': true,
  'mongo': MONGO_URI || 'mongodb://mongo/govolunteer',

  'session': true,
  'auth': true,
  'user model': 'User',
  'cloudinary config': CLOUDINARY_CONFIG,
  'cloudinary secure': true,

  'cookie secret': COOKIE_SECRET,

  'wysiwyg images': true,

  // SSL settings
  'ssl': 'force',
  'ssl key': SSL_KEY_PATH,
  'ssl cert': SSL_CERT_PATH,
  'ssl ca': SSL_CA_PATH,
  'ssl port': 3001,
  'ssl public port': 443,
});

// Configure i18next
i18next
  .use(i18nExpressMiddleware.LanguageDetector)
  .use(FilesystemBackend)
  .init({
    initImmediate: false,
    load: 'languageOnly',
    whitelist: ['en', 'de'],
    preload: ['en', 'de'],
    fallbackLng: 'en',
    debug: false,
    saveMissing: true,
    backend: {
      // path where resources get loaded from
      loadPath: 'locales/{{lng}}.json',

      // path to post missing resources
      addPath: 'locales/{{lng}}.missing.json',

      // jsonIndent to use when storing json files
      jsonIndent: 2
    },
    detection: {
      order: ['path', 'session', 'querystring', 'cookie', 'header'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupSession: 'lng',
      caches: ['cookie']
    }
  })

// i18next is ready immediately
keystone.set('i18next', i18next)

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
  _: require('lodash'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  posts: ['posts', 'post-categories'],
  users: 'users'
});

keystone.start()
