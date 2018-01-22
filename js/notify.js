/*const notify = () => {

}*/
window.notify = window.alert = async function(){
	await customElements.whenDefined('dy-notifications')
	DYNotifications.instance.notify(...arguments)
}