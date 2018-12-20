const keystone = require('keystone')

exports = module.exports = function (req, res) {

	let view = new keystone.View(req, res)
	let locals = res.locals

	// Init locals
	locals.section = 'blog'
	locals.filters = {
		category: req.params.category,
	}
	locals.data = {
	  page: 1,
		posts: [],
		categories: [],
	}

	// Load all categories
	view.on('init', async function (next) {
		try {
			let categories = await keystone.list('PostCategory').model.find().sort('name')
      locals.data.categories = categories
      // Load the counts for each category
			for (category of categories) {
			  category.postCount = await keystone.list('Post').model.count().where('categories').in([category.id])
      }
      next()
		} catch(err) {
		  return next(err)
    }
	})

	// Load the current category filter
	view.on('init', async function (next) {
	  try {
      if (req.params.category) {
        locals.data.category = await keystone.list('PostCategory').model.findOne({ key: locals.filters.category })
        locals.title = req.language === 'de' ? locals.data.category.title.de : locals.data.category.title.en
      }
      next()
    } catch(err) {
	    return next(err)
    }
	})

	// Load the posts
	view.on('init', function (next) {

    let filters = {
      state: 'published'
    }

    if (locals.data.category) {
      filters.categories = { $in: [locals.data.category]}
    }

    filters['title.' + req.language] = { $exists: true }

    locals.data.page = req.query.page || 1

		let q = keystone.list('Post').paginate({
			page: locals.data.page,
			perPage: 6,
			filters: filters,
		})
			.sort('-publishedDate')


		q.exec(function (err, results) {
			locals.data.posts = results
			next(err)
		})
	})

	// Render the view
	view.render('blog')
}
