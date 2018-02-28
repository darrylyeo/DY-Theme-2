// From base directory: node compile.node.js

const {promisify} = require('util')

const fs = require('fs')
const path = require('path')

const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)
const writeFile = promisify(fs.writeFile)

const getFiles = async (directory, extension) => (await readdir(directory))
	.map(file => path.join(directory, file))
	.filter(file => extension ? file.endsWith(extension) : true)

Array.prototype.mapAsync = function(){
	return Promise.all(this.map(...arguments))
}


const {ASSETS, ASSETS_COMPILED} = require('./assets.js')

;(async () => {
	const files = ASSETS.JS // await getFiles('js', '.js')
	const contents = await files.mapAsync(file =>
		readFile(file)
			.then(contents => `// ${file}\n\n${contents}`)
	)
	await writeFile('build/all.js', contents.join('\n\n\n'))
	console.log('Compiled JS.')
})()

;(async () => {
	const files = ASSETS.CSS // await getFiles('css', '.css')
	const contents = await files.mapAsync(file =>
		readFile(file)
			.then(contents => `/* ${file} */\n\n${contents}`)
	)
	await writeFile('build/all.css', contents.join('\n\n\n'))
	console.log('Compiled CSS.')
})()