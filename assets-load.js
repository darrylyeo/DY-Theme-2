function loadAssets(ASSETS){
	for(const path of ASSETS.CSS) document.head.appendChild(Object.assign(document.createElement('link'), {
		rel: 'stylesheet',
		href: `${WP.parentTheme}/${path}`
	}))
	for(const path of ASSETS.JS) document.body.appendChild(Object.assign(document.createElement('script'), {
		type: 'text/javascript',
		src: `${WP.parentTheme}/${path}`,
		async: false
	}))
}
loadAssets(ASSETS)
//loadAssets(ASSETS_COMPILED)