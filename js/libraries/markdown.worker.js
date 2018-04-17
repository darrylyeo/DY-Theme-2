// Based on https://github.com/developit/snarkdown/blob/master/src/index.js

const trim = str => str.replace(/^\n+|\n+$/g, '')
const outdent = str => str.replace(RegExp(`^${(str.match(/^(\t| )+/) || '')[0]}`, 'gm'), '')
const encode = str => String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function markdown(md, inlineOnly, links = {}) {
	if(!md) return ''

	const tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^```(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  +).+)+\n*)|(?:^|\n)([.>*+-])\s.*(?:\n(?:\5|\t|  +).*)*\n*()|(?:\!\[([^\]]*?)\]\(([^\)]+?)\))|\[(.*?)\](?:\((\S*)(?: "(.*)")?\))?|(?:(?:^|\n+)([^\s].*)\n(\-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,3})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(__|\*\*)|([_*])|(  \n\n*)|(\n\n+)/gm

	const openTags = []
	function tag(tagName) {
		if(openTags[0] === tagName){
			openTags.shift()
			return `</${tagName}>`
		}else{
			openTags.unshift(tagName)
			return `<${tagName}>`
		}
	}
	function flush() {
		return [...openTags].map(tag).join('')
	}
	let out = ''

	let currentBlock = ''
	const endBlock = () => {
		currentBlock += flush()
		if(currentBlock){
			out += `<p>${currentBlock}</p>`// + '\n\n'
			currentBlock = ''
		}
	}
	const write = s => {
		if(currentBlock){
			currentBlock += s
		}else{
			out += s
		}
	}
	const writeBlock = s => {
		endBlock()
		out += s// + '\n\n'
	}
	const writeInline = inlineOnly ? write : s => {
		currentBlock += s
	}

	md = md.replace(/^\[(.+?)\]:\s*(.+)$/gm, (_, name, url) => {
		links[name.toLowerCase()] = url
		return ''
	})
	md = md.replace(/^\d+\. /gm, '. ')
	md = trim(md)

	let lastIndex = 0
	let token

	while(token = tokenizer.exec(md)) {
		let [match, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20] = token

		const prev = md.substring(lastIndex, token.index)
		lastIndex = tokenizer.lastIndex
		writeInline(prev)

		if (prev.match(/[^\\](\\\\)*\\$/)) {
			// escaped
		}
		// Code/Indent blocks:
		else if (_3 || _4) {
			writeBlock(`<pre><code class="${_4 ? 'poetry' : _2.toLowerCase()}">${outdent(trim(encode(_3 || _4)))}</code></pre>`)
		}
		// > Quotes, -* lists:
		else if (_5) {
			let tagName
			let inner = outdent(match)
			if (_5 === '>'){
				tagName = 'blockquote'
				inner = markdown(outdent(inner.replace(/^\s*>/gm, ' ')), false, links)
			}else{
				tagName = _5 === '.' ? 'ol' : 'ul'
				inner = inner.replace(/^[*+.-](.*(?:\n(?![*+.-]).*)*)/gm, (_, $1) => `<li>${markdown(outdent(' ' + $1), false, links)}</li>\n`)
			}
			
			writeBlock(`<${tagName}>${inner}</${tagName}>\n\n`)
		}
		// Images:
		else if (_8) {
			write(`<img src="${encode(_8)}" alt="${encode(_7)}">`)
		}
		// Links:
		else if (_9) {
			writeInline(`<a href="${encode(_10 || links[_9.toLowerCase()])}"${_11 ? ` title="${encode(_11)}"` : ''}>${markdown(_9, true, links)}</a>`)
		}
		// Headings:
		else if (_12 || _14) {
			const tagName = `h${_14 ? _14.length : (_13[0] === '=' ? 1 : 2)}`
			writeBlock(`<${tagName}>${markdown(_12 || _15, true, links)}</${tagName}>`)
		}
		else if(_1){
			writeBlock('<hr>')
		}
		// Inline formatting: *em*, **strong** & friends
		// `code`:
		else if (_16) {
			writeInline(`<code>${encode(_16)}</code>`)
		}
		else if (_17) {
			writeInline(tag('strong'))
		}
		else if (_18) {
			writeInline(tag('em'))
		}
		else if (_19) {
			write('<br>')
		}
		else if (_20) {
			endBlock()
		}
	}
	writeInline(md.substring(lastIndex))
	endBlock()

	return out.trim()
}

self.addEventListener('message', e => postMessage(markdown(...e.data)))