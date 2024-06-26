export default {

	async startUp () {
		const tokenExist = appsmith.store.token;

		if (tokenExist) {
			return await navigateTo("Home");
		}

		try {
			await gg_get_token.run()

			const tokenInfo = gg_get_token.data
			const idToken = tokenInfo.id_token;
			const decodedToken = await jsonwebtoken.decode(idToken);
			const email = decodedToken.email
			await check_email_exist.run({email})
			const id = check_email_exist.data[0].id	
			if (check_email_exist.data.length === 0 ){
				await clearStore()
				return await navigateTo("Home");
			}

			await storeValue('token', tokenInfo);
			await storeValue('user', decodedToken);
			await add_token_to_db.run({id, idToken});

			showAlert('Check ok','success')
			await navigateTo("Home");
		} catch(error) {
			showAlert(error,'error')
			await navigateTo("Login");
		}
	},




}
