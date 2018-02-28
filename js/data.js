const getJSON = url => fetch(url).then(data => data.json())
//const getJSON = async url => (await fetch(url)).json()

URL.pathName = function(url){
	return (new URL(url)).pathname
}

{
let data = {}

var DY = {
	getDatabase: (async () => {
		const DB_VERSION = 1

		let updateNeeded = false
		
		const db = await indexedDB.openDatabase('Darryl-Yeo', DB_VERSION, {
			'data': {
				keyPath: 'key'
			},

			'wp-objects': {
				keyPath: 'link',
				//autoIncrement: true,
				indices: {
					'link': {
						unique: true
					},
					'id': {
						unique: true
					},
					'term_id': {
						unique: true
					},
					'objectType': {
						unique: false
					},
					'date_gmt': {
						unique: false
					},
					'modified_gmt': {
						unique: false
					}
				}
			},

			'wp-taxonomies': {
				keyPath: 'order',
				indices: {
					'slug': {
						unique: true
					}
				}
			}
		}, {
			upgrade(){
				updateNeeded = true
			}
		})

		X('Database accessed.')

		if(updateNeeded){
			X('Database has been upgraded. Waiting to update data...')
			await DY.updateDatabase(db)
			X('Data updated.')
		}else{
			X('Updating data in background...')
			DY.updateDatabase(db).then(() => X('Data updated.'))
		}

		return db
	})(),

	updateDatabase: async db => {
		const [
			pages,
			posts,
			taxonomies,
			termsByTaxonomy
		] = await Promise.all([
			getJSON(`${WP.rest}/pages?per_page=100`),
			getJSON(`${WP.rest}/posts?per_page=100&post_status=published`),
			getJSON(`${WP.rest}/taxonomies`).then(Object.values),
			getJSON(`${WP.rest}/terms`)
		])

		db = db || await DY.getDatabase

		const terms = Object.values(termsByTaxonomy).flatten()
		const projectsCategory = termsByTaxonomy['page-category'].find(term => term.slug === 'project')
		const PROJECT_CATEGORY_ID = projectsCategory.term_id

		const objectsStore = db.getObjectStore('wp-objects', true)
		function putObject(object, objectType){
			object.objectType = objectType
			objectsStore.put(object)
		}

		for(const page of pages){
			putObject(page, page.terms.includes(PROJECT_CATEGORY_ID) ? 'project' : 'page')
		}
		for(const post of posts) putObject(post, 'post')
		for(const term of terms) putObject(term, 'term')


		const taxonomiesStore = db.getObjectStore('wp-taxonomies', true)
		for(const [i, taxonomy] of taxonomies.entries()){
			taxonomy.order = i
			taxonomiesStore.put(taxonomy)
		}

		return db
	},
	
	getObjectForURL: async url => (await DY.getDatabase)
		.getObjectStore('wp-objects')
		.index('link')
		.get(url),

	getObjectsByType: async type => (await DY.getDatabase)
		.getObjectStore('wp-objects')
		.index('objectType')
		.getAll(type),

	getTermById: async id => (await DY.getDatabase)
		.getObjectStore('wp-objects')
		.index('term_id')
		.get(id),

	getTaxonomies: async () => (await DY.getDatabase)
		.getObjectStore('wp-taxonomies')
		.getAll(),


	getUser: fetch(`${WP.rest}/users/me?context=edit`, {
		credentials: 'same-origin',
		headers: {
			'X-WP-Nonce': WP.restNonce
		}
	})
		.then(async response => {
			const data = await response.json()
			// X(response)
			if(response.status === 200){
				return data
			}else if(response.status === 401){
				throw data
			}
		})
		.catch(e => X(e.message, e)),

	data: async key => {
		if(key in data) return data[key]

		const dataObj = await (await DY.getDatabase).getObjectStore('data').get(key)
		const value = dataObj && dataObj.value || {}
		data[key] = value
		return value
	},

	clearData: async () => {
		data = {},
		(await DY.getDatabase).getObjectStore('data', true)
			.clear()
			.then( () => console.log('Deleted object store "data".'))
	},

	clearDatabase: () => indexedDB.removeDatabase('Darryl-Yeo')
}

window.on({
	beforeunload: () => {
		(async () => {
			(await DY.data('lastSession')).date = Date.now()
			
			const store = (await DY.getDatabase).getObjectStore('data', true)
			for(const key in data){
				store.put({
					key,
					timestamp: Date.now(),
					value: data[key]
				})
			}
		})()
	}
})

}