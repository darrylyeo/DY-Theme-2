const getJSON = url => fetch(url).then(data => data.json())
//const getJSON = async url => (await fetch(url)).json()

URL.pathName = function(url){
	return (new URL(url)).pathname
}

DY.getDatabase = (async () => {
	const DB_VERSION = 1

	let updateNeeded = false
	
	const db = await indexedDB.openDatabase('Darryl-Yeo', DB_VERSION, {
		'settings': {
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
})()


DY.updateDatabase = async db => {
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
}

DY.getObjectForURL = async url => (await DY.getDatabase)
	.getObjectStore('wp-objects')
	.index('link')
	.get(url)

DY.getObjectsByType = async type => (await DY.getDatabase)
	.getObjectStore('wp-objects')
	.index('objectType')
	.getAll(type)

DY.getTermById = async id => (await DY.getDatabase)
	.getObjectStore('wp-objects')
	.index('term_id')
	.get(id)

DY.getTaxonomies = async () => (await DY.getDatabase)
	.getObjectStore('wp-taxonomies')
	.getAll()


DY.getUser = fetch(`${WP.rest}/users/me?context=edit`, {
	credentials: 'same-origin',
	headers: {
		'X-WP-Nonce': WP.restNonce
	}
})
	.then(async response => {
		const data = await response.json()
		X(response)
		if(response.status === 200){
			return data
		}else if(response.status === 401){
			throw data
		}
	})
	.catch(e => {
		X(e.message, e)
		return
	})