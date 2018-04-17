{
const $canvas = document.createElement('canvas')
const ctx = $canvas.getContext('2d')

var blurImage = (src, blur = 17) => new Promise(resolve => {
	const $img = document.createElement('img')
	$img.src = src
	$img.onload = () => requestAnimationFrame(async () => {
		/*const offset = blur
		const width = c.width = img.naturalWidth - offset * 2
		const height = c.height = img.naturalHeight - offset * 2
		ctx.drawImage(img, -offset, -offset, width, height)*/
		
		const width = $canvas.width = Math.min($img.naturalWidth, 450)
		const height = $canvas.height = Math.floor($img.naturalHeight / $img.naturalWidth * width)
		if(ctx.filter){
			ctx.filter = `blur(${blur}px)`
		}
		ctx.drawImage($img, 0, 0, width, height)
		if(!ctx.filter){
			const imageData = ctx.getImageData(0, 0, width, height)
			ctx.putImageData(await stackBlur(imageData, blur), 0, 0)
		}

		resolve(`url(${$canvas.toDataURL()})`)
	})
})
}