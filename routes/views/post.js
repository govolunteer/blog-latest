const keystone = require('keystone')

exports = module.exports = function (req, res) {

	let view = new keystone.View(req, res)
	let locals = res.locals

	// Set locals
	locals.section = 'blog'
	locals.filters = {
		post: req.params.post,
	}
	locals.data = {
		recentPosts: [],
		categoryPosts: []
	}

	// Load the current post
	view.on('init', async function (next) {
		try {
      locals.data.post = await keystone.list('Post').model.findOne({
        state: 'published',
        key: locals.filters.post,
      }).populate('author categories')
        .exec()

      locals.title = locals.data.post['title'][req.language]
      locals.description = locals.data.post['description'][req.language]

			next()
		} catch(err) {
			next(err)
		}
	})

	// Load 3 recent posts
	view.on('init', async function (next) {
	  try {
	    locals.data.recentPosts = await keystone.list('Post').model.find()
        .where('state', 'published')
        .where('title.' + req.language).exists()
        .sort('-publishedDate')
        .limit(3);
	    next()
    } catch(err) {
	    next(err)
    }
	})

  // Load 3 recent category posts
  view.on('init', async function (next) {
    try {
      locals.data.categoryPosts = await keystone.list('Post').model.find()
        .where('_id').ne(locals.data.post.id)
        .where('state', 'published')
        .where('title.' + req.language).exists()
        .where('categories').in(locals.data.post.categories)
        .sort('-publishedDate')
        .limit(3)
      next()
    } catch(err) {
      next(err)
    }
  })

	// Render the view
	view.render('post')
}
