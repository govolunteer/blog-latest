/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

const keystone = require('keystone')
const middleware = require('./middleware')
const importRoutes = keystone.importer(__dirname)

const i18nExpressMiddleware = require('i18next-express-middleware')

// Common Middleware
keystone.pre('routes', middleware.initLocals)
keystone.pre('render', middleware.flashMessages)

// Import Route Controllers
let routes = {
	views: importRoutes('./views'),
	redirects: importRoutes('./redirects')
}

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
  let i18next = keystone.get('i18next')
  app.use(i18nExpressMiddleware.handle(i18next))

	app.get('/:lng(en|de)/:category?', middleware.initMenu, routes.views.blog)
	app.get('/:lng(en|de)/post/:post', middleware.initMenu, routes.views.post)

  app.get(/^\/(?!(en$|de$|robots\.txt$))/, middleware.initMenu, routes.redirects.index)
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

}
