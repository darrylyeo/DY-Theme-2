const ASSETS_CACHE = 'darrylyeo-assets-1.0.0'
const CONTENT_CACHE = 'darrylyeo-content-1.0.0'
const urlsToCache = [
	'./',
	
	'./css/variables.css',
	'./css/fonts.css',
	'./css/general.css',
	'./css/page.css',
	//'./css/page-load.css',
	'./css/article.css',
	'./css/navigation.css',

	'./components/dy-button.css',
	'./components/dy-date.css',
	'./components/dy-figure.css',
	'./components/dy-icon.css',
	'./components/dy-terms.css',
	
	'./components/dy-table-of-contents.css',
	'./components/dy-comments.css',

	'./components/dy-projects.css',
	'./components/dy-project.css',
	'./components/dy-project-header.css',
	
	'./components/dy-khan.css',
	'./components/dy-khan-badge.css',
	'./components/dy-khan-stats.css',
	
	'./js/libraries/moment.min.js',

	'./js/globals.js',
	'./js/workers.js',
	'./js/bind.js',
	'./js/navigation.js',
	'./js/notify.js',

	'./js/framework/blur-image.js',

	'./js/framework/idb-database.js',
	'./js/data.js',
	'./js/page.js',
	'./js/components.js',

	'./js/framework/animate-state.js',

	'./components/dy-style.js',
	'./components/dy-date.js',
	'./components/dy-figure.js',
	'./components/dy-icon.js',
	'./components/dy-terms.js',

	'./components/dy-sidebar.js',
	'./components/dy-table-of-contents.js',
	'./components/dy-comments.js',

	'./components/dy-projects.js',
	'./components/dy-project.js',
	'./components/dy-project-header.js',
	
	'./components/dy-khan.js',
	'./components/dy-khan-badge.js',
	'./components/dy-khan-stats.js',
	
		'./js/experiments.js',

	'http://localhost:8888/darrylyeo/wp-json/wp/v2/pages?per_page=100',
	'http://localhost:8888/darrylyeo/wp-json/wp/v2/posts?per_page=100&post_status=published',
	'http://localhost:8888/darrylyeo/wp-json/wp/v2/taxonomies',
	'http://localhost:8888/darrylyeo/wp-json/wp/v2/terms'
].map(url => url.replace(/^\./, 'http://localhost:8888/darrylyeo2'))

self.addEventListener('install', event => {console.log('install', event)
	// Perform install steps
	event.waitUntil(
		caches.open(ASSETS_CACHE)
			.then(cache => {
				console.log('Opened cache')
				return cache.addAll(urlsToCache)
			})
	)
})


self.addEventListener('fetch', event => {console.log('fetch', event)
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				// Cache hit - return response
				if (response) {
					console.log('Cache hit - return response', response)
					return response
				}
				console.log('fetching', event.request)
				return fetch(event.request)
			})
	)
})