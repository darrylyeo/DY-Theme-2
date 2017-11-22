var request = window.indexedDB.open("IDBWrapper-storage", 1)
request.onerror = e => console.error(e.request.errorCode)
request.onsuccess = e => {
	const db = e.target.result
	console.log('Database: ', db)

	const objectStore = db.transaction('storage', 'readonly').objectStore('storage')
	console.log('Object Store: ', objectStore)

	const getRequest = objectStore.get('currentProject')
	getRequest.onsuccess = e => {
		const result = e.target.result
		const id = result.obj

		const getRequest = objectStore.get(id)
		getRequest.onsuccess = e => {
			const result = e.target.result
			console.log(result.obj)
			console.log(JSON.stringify(result.obj))
		}
	}
}