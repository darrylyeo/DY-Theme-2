// Based on https://www.quaxio.com/html_white_listed_sanitizer/

{

function sanitizeHTML(string){
	const template = document.createElement('template')
	template.innerHTML = string.trim()
	return document.importNode(sanitizeNode(template.content), true)
}

function sanitizeNode(node, tagWhiteList = ['p', 'a', 'strong', 'em', 'b', 'i', 's', 'del', 'ins', 'code', 'pre', 'ul', 'ol', 'li', 'br', 'hr', 'span'], attrWhiteList = ['href']) {
	if(node.nodeType === Node.TEXT_NODE) return node
	if(node.nodeType === Node.COMMENT_NODE) return node.remove()
	
	if(node.nodeType === Node.ELEMENT_NODE) for(const attr of [...node.attributes]) {
		const name = attr.name
		if(attrWhiteList.includes(name)) {
			node.setAttribute(name, sanitizeURL(node.getAttribute(name)))
		}else{
			node.removeAttribute(name)
		}
	}
	
	const nodeName = node.nodeName.toLowerCase()
	const children = [...node.childNodes]
	if(tagWhiteList.includes(nodeName)){
		if(nodeName === 'pre') tagWhiteList = ['code']
		for(const child of children) sanitizeNode(child, tagWhiteList)
	}else if(node.parentNode){
		for(const child of children) sanitizeNode(child)
		if(node.firstChild) node.replaceWith(`<${nodeName}>`, ...node.childNodes, `</${nodeName}>`)
		else node.replaceWith(node.outerHTML)
	}else{
		for(const child of children) sanitizeNode(child)
	}
	return node
}

function sanitizeURL(url){
	try {
		const {protocol, href} = new URL(url)
		return ['https:', 'http:'].includes(protocol) ? href : ''
	}catch(e){
		return ''
	}
}

}

/*Node.prototype.sanitize = function(){ return this }
Comment.prototype.sanitize = function(){ return this.remove() }
Element.prototype.sanitize = function(tagWhiteList = ['p', 'a', 'strong', 'em', 'b', 'i', 's', 'del', 'ins', 'code', 'pre', 'ul', 'ol', 'li', 'br', 'hr', 'span'], attrWhiteList = ['href']){
	for(const attr of [...this.attributes]) {
		const name = attr.name
		if(attrWhiteList.includes(name)) {
			node.setAttribute(name, sanitizeURL(node.getAttribute(name)))
		}else{
			node.removeAttribute(name)
		}
	}
	ParentNode.prototype.sanitize.call(this, arguments)
}
ParentNode.prototype.sanitize = function(){
	const nodeName = node.nodeName.toLowerCase()
	const children = [...node.childNodes]
	if(tagWhiteList.includes(nodeName)){
		if(nodeName === 'pre') tagWhiteList = ['code']
		for(const child of children) child.sanitize(tagWhiteList)
	}else if(node.parentNode){
		for(const child of children) child.sanitize()
		if(node.firstChild) node.replaceWith(`<${nodeName}>`, ...node.childNodes, `</${nodeName}>`)
		else node.replaceWith(node.outerHTML)
	}else{
		for(const child of children) child.sanitize()
	}
	return this
}*/