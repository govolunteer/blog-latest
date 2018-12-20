const keystone = require('keystone')
const Types = keystone.Field.Types

/**
 * PostCategory Model
 * ==================
 */

let PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
})

PostCategory.add({
	name: { type: String, required: true },
  lng: { type: Types.Select, options: 'en, de', default: 'en'},
  title: {
    en: {type: String, dependsOn: { lng: 'en' } },
    de: {type: String, dependsOn: { lng: 'de' } }
  }
})

PostCategory.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' })

PostCategory.register()
