export default {






	async check() {
		try{
			await count_token_in_db.run()
			const countToken = count_token_in_db.data[0].count

			if (countToken === 0){
				showAlert(message.Error.TOKEN_NOT_EXST,'error')
				return	await auth.logout()
			}
		}catch(error){
			showAlert(message.Error.TOKEN_NOT_EXST,'error')
			return	await auth.logout()
		}
	}
}