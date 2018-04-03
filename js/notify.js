/*const notify = () => {

}*/
window.notify = window.alert = async function(){
	await customElements.whenDefined('dy-notifications')
	return DYNotifications.instance.notify(...arguments)
}