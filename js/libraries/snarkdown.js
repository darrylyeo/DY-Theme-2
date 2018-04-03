// Based on https://github.com/developit/snarkdown/blob/master/src/index.js

{

const TAGS = {
	'': ['<em>', '</em>'],
	_: ['<strong>', '</strong>'],
	'\n': ['<br />'],
	' ': ['<br />'],
	'-': ['<hr />']
}

const outdent = str => str.replace(RegExp(`^${(str.match(/^(\t| )+/) || '')[0]}`, 'gm'), '')
const encodeAttr = str => str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function markdown(md, prevLinks) {
	const tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^```(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:\!\[([^\]]*?)\]\(([^\)]+?)\))|(\[)|(\](?:\(([^\)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(\-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,3})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*])/gm
	const context = []
	let out = ''
	const links = prevLinks || {}
	let last = 0
	let token
	let inner
	let tagName

	function tag(token) {
		const desc = TAGS[token.replace(/\*/g, '_')[1] || '']
		const end = context[context.length - 1] == token
		if (!desc) return token
		if (!desc[1]) return desc[0]
		context[end ? 'pop' : 'push'](token)
		return desc[end | 0]
	}

	function flush() {
		let str = ''
		while (context.length) str += tag(context[context.length - 1])
		return str
	}

	md = md.replace(/^\[(.+?)\]:\s*(.+)$/gm, (s, name, url) => {
		links[name.toLowerCase()] = url
		return ''
	}).replace(/^\n+|\n+$/g, '')

	while (token = tokenizer.exec(md)) {
		let [chunk, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17] = token
		const prev = md.substring(last, token.index)
		last = tokenizer.lastIndex
		if (prev.match(/[^\\](\\\\)*\\$/)) {
			// escaped
		}
		// Code/Indent blocks:
		else if (_3 || _4) {
			chunk = `<pre><code class="${_4 ? 'poetry' : _2.toLowerCase()}">${outdent(encodeAttr(_3 || _4).replace(/^\n+|\n+$/g, ''))}</code></pre>`
		}
		// > Quotes, -* lists:
		else if (_6) {
			tagName = _6
			if (tagName.match(/\./)) {
				_5 = _5.replace(/^\d+/gm, '')
			}
			inner = markdown(outdent(_5.replace(/^\s*[>*+.-]/gm, '')))
			if (tagName === '>') tagName = 'blockquote'
			else {
				tagName = tagName.match(/\./) ? 'ol' : 'ul'
				inner = inner.replace(/^(.*)(\n|$)/gm, '<li>$1</li>')
			}
			chunk = `<${tagName}>${inner}</${tagName}>`
		}
		// Images:
		else if (_8) {
			chunk = `<img src="${encodeAttr(_8)}" alt="${encodeAttr(_7)}">`
		}
		// Links:
		else if (_10) {
			out = out.replace('<a>', `<a href="${encodeAttr(_11 || links[prev.toLowerCase()])}">`)
			chunk = `${flush()}</a>`
		}
		else if (_9) {
			chunk = '<a>'
		}
		// Headings:
		else if (_12 || _14) {
			tagName = `h${_14 ? _14.length : (_13[0] === '=' ? 1 : 2)}`
			chunk = `<${tagName}>${markdown(_12 || _15, links)}</${tagName}>`
		}
		// `code`:
		else if (_16) {
			chunk = `<code>${encodeAttr(_16)}</code>`
		}
		// Inline formatting: *em*, **strong** & friends
		else if (_17 || _1) {
			chunk = tag(_17 || '--')
		}
		out += prev
		out += chunk
	}

	return (out + md.substring(last) + flush()).trim()
}

}