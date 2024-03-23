export default {

	async startUp () {
		const tokenExist = appsmith.store.token;

		if (tokenExist) {
			return await navigateTo("Home");
		}

		const code = appsmith.URL.queryParams.code;
		if (!code) {
			return await navigateTo("Login");
		}

		try {
			await this.exchangeCodeToToken();
			return await navigateTo("Home");
		} catch(error) {
			await navigateTo("Login");
		}
	},

	exchangeCodeToToken: async () => {
		// await this.getEnvInfo();
		try {
			const tokenInfo = await gg_get_token.run();
			await storeValue('token', tokenInfo);
			await this.saveUserToLocal(tokenInfo);
			await this.saveTokenToDb(tokenInfo);
		} catch (error) {
			showAlert("failed to exchage token", 'error');
			throw error;
		}
	},

	saveUserToLocal: async (tokenInfo) => {
		const idToken = tokenInfo.id_token;
		const decodedToken = await jsonwebtoken.decode(idToken);
		await storeValue('user', decodedToken);
	},

	saveTokenToDb: async (tokenInfo) => {
		const idToken = tokenInfo.id_token;
		const email = appsmith.store.user['email'];
		try {
			await add_user_info_to_db.run({email, token: idToken});
		} catch (error) {
			// console.error("failed to save token to db");
			throw error;
		}
	},
}
