const DY = {
	data: {
		experiments: {}
	}
}

// const WP = {
// 	siteURL: 'http://localhost:8888/darrylyeo/',
// 	themes: 'http://localhost:8888/darrylyeo/wp-content/themes',
// 	parentTheme: 'http://localhost:8888/darrylyeo/wp-content/themes/DY',
// 	childTheme: 'http://localhost:8888/darrylyeo/wp-content/themes/DY',
// }
const WP = {
	siteURL: 'http://localhost:8888/darrylyeo2/',
	themes: 'http://localhost:8888/darrylyeo2/',
	parentTheme: 'http://localhost:8888/darrylyeo2/',
	childTheme: 'http://localhost:8888/darrylyeo2/',
}
Object.assign(WP, {
	API: `http://localhost:8888/darrylyeo/wp-json/wp/v2`
})