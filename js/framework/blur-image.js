const blurImage = (src, blur = 15) => new Promise(resolve => {
	const img = document.createElement('img')
	img.src = src
	const c = document.createElement('canvas')
	const ctx = c.getContext('2d')

	img.onload = () => {
		c.width = img.width - blur * 2
		c.height = img.height - blur * 2
		ctx.filter = `blur(${blur}px)`
		ctx.drawImage(img, -blur, -blur)
		resolve(`url(${c.toDataURL()})`)
	}
})