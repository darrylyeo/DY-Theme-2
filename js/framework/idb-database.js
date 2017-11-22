IDBFactory.prototype.openDatabase = (name, version = 1, structure = {}, {error, upgrade, success} = {}) => new Promise((resolve, reject) => {
	const request = window.indexedDB.open(name, version)
	
	Object.assign(request, {
		onerror(e){
			//error.call(this, e)
			reject(e) // e.target.errorCode
		},
		onupgradeneeded(e){
			const db = e.target.result
			const transaction = e.target.transaction
			
			for(const storeName in structure){
				const {keyPath, autoIncrement, indices} = structure[storeName]
				
				const objectStore = db.objectStoreNames.contains(storeName)
					? transaction.objectStore(storeName)
					: db.createObjectStore(storeName, {keyPath, autoIncrement})
				for(const indexName in indices){
					const {property = indexName, unique} = indices[indexName]
					if(objectStore.indexNames.contains(indexName)) objectStore.deleteIndex(indexName)
					objectStore.createIndex(indexName, property, {unique})
				}
			}
			
			upgrade && upgrade.call(db, db, e)
		},
		onsuccess(e){
			const db = e.target.result
			db.onerror = event => {
				console.error(event.target.error)
			}
			//success && success.call(db, db, e)
			resolve(db)
		}
	})
})

IDBDatabase.prototype.getObjectStore = function(storeName, allowWrite = false, complete){
	const transaction = this.transaction(storeName, allowWrite ? 'readwrite' : 'readonly')
	
	transaction.oncomplete = complete || (e => {
		//console.log(`Transaction to store "${storeName}" successful.`)
	})
	
	const store = transaction.objectStore(storeName)
	return store
}

IDBRequest.prototype.then = function(callback){
	this.addEventListener('success', e => {
		callback.call(this, e.target.result)
	})
}

IDBRequest.prototype.getResult = function(callback){
	return new Promise((resolve, reject) => {
		this.addEventListener('success', e => {
			resolve(e.target.result)
		})
	})
}