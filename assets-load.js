var DETECT = {
	es2015: true
}
try { eval(`async () => {}`) } catch(e) { DETECT.es2015 = false }


if(DETECT.es2015){
	loadAssets(ASSETS)
	// loadAssets(ASSETS_COMPILED)
	// loadAssets(ASSETS_COMPILED_MINIFIED)
}else{
	// Message for unsupported browsers
	document.body.innerText = `Welcome to my site! Unfortunately, you'll need to use a newer browser.`
	document.documentElement.addClass('load')
}


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
	for(const [func, path] of Object.entries(ASSETS.WORKER_FUNCTIONS)){
		window[func] = new WorkerFunction(`${WP.parentTheme}/${path}`)
	}
}

function WorkerFunction(url){
	return (...args) => new Promise(resolve => {
		const worker = WorkerFunction.workers[url] || (WorkerFunction.workers[url] = new Worker(url))
		worker.postMessage(args)
		worker.addEventListener('message', e => resolve(e.data), {once: true})
	})
}
WorkerFunction.workers = {}
