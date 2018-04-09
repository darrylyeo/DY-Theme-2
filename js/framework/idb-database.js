IDBFactory.prototype.removeDatabase = function(name){
	return new Promise((resolve, reject) => {
		this.deleteDatabase(name)
			.then(result => {
				console.log(`Deleted database ${name}`, result)
				resolve()
			})
			.catch(e => {
				console.log(`Error deleting database ${name}`, e)
				reject(e)
			})
	})
}

IDBDatabase.prototype.getObjectStore = function(storeName, allowWrite = false, complete){
	const transaction = this.transaction(storeName, allowWrite ? 'readwrite' : 'readonly')
	transaction.oncomplete = complete || (e => {
		//console.log(`Transaction to store "${storeName}" successful.`)
	})
	
	const store = transaction.objectStore(storeName)
	return store
}


IDBRequest.prototype.withStructure = function(structure){
	this.addEventListener('upgradeneeded', e => {
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
	})
	return this
}
IDBRequest.prototype.then = function(callback){
	try {
		if(this.result) callback.call(this, this.result)
	}catch(e){
		this.addEventListener('success', e => {
			const {result} = e.target
			if(result instanceof IDBDatabase) result.onerror = e => console.error(e.target.error)
			callback.call(this, result)
		})
	}
	return this
}
IDBRequest.prototype.catch = function(callback){
	this.addEventListener('error', e => {
		callback.call(this, e.target.error)
	})
	return this
}

IDBRequest.prototype.getResult = function(){
	return new Promise((resolve, reject) => {
		this.addEventListener('success', e => {
			resolve(e.target.result)
		})
	})
}