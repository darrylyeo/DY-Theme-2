const getJSON = url => fetch(url).then(data => data.json())
//const getJSON = async url => (await fetch(url)).json()

URL.pathName = function(url){
	return (new URL(url)).pathname
}

DY.getDatabase = (async () => {
	const DB_VERSION = 1

	let upgradeNeeded = false
	
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
			upgradeNeeded = true
		}
	})

	X('Database accessed.')

	if(upgradeNeeded){
		X('Database has been upgraded. Waiting to update data...')
		await updateDatabase(db)
		X('Data updated.')
	}else{
		X('Updating data in background...')
		updateDatabase(db).then(() => X('Data updated.'))
	}

	return db
})()


const updateDatabase = async db => {
	const [
		pages,
		posts,
		taxonomies,
		termsByTaxonomy
	] = await Promise.all([
		getJSON('http://localhost:8888/darrylyeo/wp-json/wp/v2/pages?per_page=100'),
		getJSON('http://localhost:8888/darrylyeo/wp-json/wp/v2/posts?per_page=100&post_status=published'),
		getJSON('http://localhost:8888/darrylyeo/wp-json/wp/v2/taxonomies').then(Object.values),
		getJSON('http://localhost:8888/darrylyeo/wp-json/wp/v2/terms')
	])

	const terms = [].concat(...Object.values(termsByTaxonomy))
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
}

DY.getObjectForURL = async url => (await DY.getDatabase)
	.getObjectStore('wp-objects')
	.index('link')
	.get(url)

DY.getObjectsByType = async type => (await DY.getDatabase)
	.getObjectStore('wp-objects')
	.index('objectType')
	.getAll(type)

DY.getTaxonomies = async () => (await DY.getDatabase)
	.getObjectStore('wp-taxonomies')
	.getAll()


DY.getUser = fetch('./wp-json/wp/v2/users/me', {
	headers: {
		'X-WP-Nonce': WP.nonce
	}
}).then(data => {
	WP.user = data
	return data
}).catch(e => {
	X('User is not logged in.', e)
	return new Promise(() => {}) // never resolve
})