export default {

	async myFun2 () {
		storeValue('test','asdad')
		const data =await get_information.run()
		storeValue('test1',data)

	}
}