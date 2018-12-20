const keystone = require('keystone')
const Types = keystone.Field.Types

let i18next = keystone.get('i18next')

/**
 * Post Model
 * ==========
 */

let Post = new keystone.List('Post', {
	autokey: { path: 'key', from: 'name', unique: true },
})

Post.add({
	name: { type: String, required: true },
	lng: { type: Types.Select, options: 'en, de', default: 'en'},
	title: {
    en: {type: Types.Text, min: 0, max: 150, dependsOn: { lng: 'en' } },
    de: {type: Types.Text, min: 0, max: 150, dependsOn: { lng: 'de' } }
  },
  intro: {
    en: {type: Types.Text, min: 0, max: 600, dependsOn: { lng: 'en' } },
    de: {type: Types.Text, min: 0, max: 600, dependsOn: { lng: 'de' } }
  },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage, select: true },
	content: {
		brief: {
      en: {type: Types.Html, wysiwyg: true, height: 150, dependsOn: { lng: 'en' } },
      de: {type: Types.Html, wysiwyg: true, height: 150, dependsOn: { lng: 'de' } }
    },
		extended: {
      en: {type: Types.Html, wysiwyg: true, height: 400, dependsOn: { lng: 'en' } },
      de: {type: Types.Html, wysiwyg: true, height: 400, dependsOn: { lng: 'de' } }
    }
	},
	description: {
		en: { type: String, dependsOn: { lng: 'en'} },
    de: { type: String, dependsOn: { lng: 'de'} }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
})

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief
})

Post.defaultColumns = 'name, state|20%, author|20%, publishedDate|20%'
Post.register()
