if ('serviceWorker' in navigator) {
	window.on('load', () => {
		navigator.serviceWorker.register(`${WP.childTheme}/js/workers/wp-data-worker.js`).then(registration => {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope)
		}, err => {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err)
		})
	})
}