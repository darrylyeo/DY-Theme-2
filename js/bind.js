function bind(objectA, objectB, propertyAToB = {}){
	return new Proxy(objectA, {
		set(objectA, propertyA, valueA){
			objectA[propertyA] = valueA

			const b = propertyAToB[propertyA]
			if(typeof b === 'string'){
				objectB[b] = valueA
			}else if(b instanceof Function){
				const valueB = b.call(objectB, objectB, propertyA, objectA)
				if(valueB) objectB[b] = valueB
			}else{
				objectB[propertyAToB[propertyA]] = valueA
			}

			return true
		}
	})
}

function deepBind(objectA, objectB, propertyAToB){
	return new Proxy(objectA, {
		set(objectA, p, v){
			if(v instanceof Object){
				v = deepBind()
			}

			objectA[p] = v
			objectB[propertyAToB[p] || p] = v
		}
	})
}