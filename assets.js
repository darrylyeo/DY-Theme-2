const ASSETS = {
	CSS: [
		'css/variables.css',
		'css/fonts.css',
		'css/general.css',
		'css/ui.css',

		'css/page.css',
		//'css/page-load.css',
		'css/article.css',
		'css/navigation.css',

		'components/dy-button.css',
		'components/dy-date.css',
		'components/dy-figure.css',
		'components/dy-icon.css',
		'components/dy-terms.css',
		'components/dy-input.css',
		
		'components/dy-notifications.css',
		'components/dy-nav.css',
		'components/dy-table-of-contents.css',
		'components/dy-comments.css',

		'components/dy-blog.css',
		'components/dy-projects.css',
		'components/dy-project.css',
		'components/dy-project-header.css',
		
		'components/dy-khan.css',
		'components/dy-khan-badge.css',
		'components/dy-khan-stats.css',
	],

	JS: [
		'js/libraries/custom-elements.min.js',
		'js/libraries/web-animations.min.js',
		'js/framework/framework.js',
		'js/libraries/moment.min.js',
		'js/libraries/intersection-observer.js',

		'js/workers.js',
		'js/bind.js',
		'js/navigation.js',
		'js/notify.js',

		'js/framework/blur-image.js',

		'js/framework/idb-database.js',
		'js/data.js',
		'js/page.js',
		'js/header.js',
		'js/components.js',

		// 'js/libraries/TweenMax.min.js',
		// 'js/framework/gsap-web-animation.js',
		'js/framework/animate-state.js',

		'components/dy-style.js',
		
		'components/dy-button.js',
		'components/dy-date.js',
		'components/dy-figure.js',
		'components/dy-icon.js',
		'components/dy-terms.js',
		'components/dy-input.js',

		'components/dy-notifications.js',
		'components/dy-sidebar.js',
		'components/dy-nav.js',
		'components/dy-table-of-contents.js',
		'components/dy-comments.js',

		'components/dy-blog.js',
		'components/dy-projects.js',
		'components/dy-project.js',
		'components/dy-project-header.js',
		
		'components/dy-khan.js',
		'components/dy-khan-badge.js',
		'components/dy-khan-stats.js',
		
		'js/experiments.js',
		'js/main.js',
	]
}


for(const path of ASSETS.CSS) document.head.appendChild(Object.assign(document.createElement('link'), {
	rel: 'stylesheet',
	href: `${WP.parentTheme}/${path}`
}))
for(const path of ASSETS.JS) document.body.appendChild(Object.assign(document.createElement('script'), {
	type: 'text/javascript',
	src: `${WP.parentTheme}/${path}`,
	async: false
}))