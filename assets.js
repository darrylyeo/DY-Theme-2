function loadGlobalStylesheet(url){
	$$$('link', {
		attr: {
			rel: 'stylesheet',
			href: url
		},
		$parent: document.head
	})
}

function loadGlobalScript(url){
	$$$('script', {
		attr: {
			type: 'text/javascript',
			src: url
		},
		async: false,
		$parent: document.body
	})
}

document.on('DOMContentLoaded', () => {
	{
		[
			'./css/variables.css',
			'./css/fonts.css',
			'./css/general.css',
			'./css/ui.css',

			'./css/page.css',
			//'./css/page-load.css',
			'./css/article.css',
			'./css/navigation.css',

			'./components/dy-button.css',
			'./components/dy-date.css',
			'./components/dy-figure.css',
			'./components/dy-icon.css',
			'./components/dy-terms.css',
			'./components/dy-input.css',
			
			'./components/dy-table-of-contents.css',
			'./components/dy-comments.css',

			'./components/dy-projects.css',
			'./components/dy-project.css',
			'./components/dy-project-header.css',
			
			'./components/dy-khan.css',
			'./components/dy-khan-badge.css',
			'./components/dy-khan-stats.css',
		].map(loadGlobalStylesheet)
	}

	{
		[
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
			'./js/header.js',
			'./js/components.js',

			'./js/framework/animate-state.js',

			'./components/dy-style.js',
			
			'./components/dy-button.js',
			'./components/dy-date.js',
			'./components/dy-figure.js',
			'./components/dy-icon.js',
			'./components/dy-terms.js',
			'./components/dy-input.js',

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
		].map(loadGlobalScript)
	}
})