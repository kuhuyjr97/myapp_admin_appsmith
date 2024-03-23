export default {
	clientId: '',
	redirectUrl: '',

	// getDBValueByKey(dbVariables, keyName) {
	// const item = dbVariables.find(item => item.key === keyName);
	// return item ? item.value : null;
	// },
	// async getDBVariables() {
	// await get_variables.run();
	// let dbVariables = get_variables.data;
	// this.clientId = this.getDBValueByKey(dbVariables, "clientId");
	// this.redirectUrl = this.getDBValueByKey(dbVariables, "redirectUrl");
	// },
	// async getEnvInfo() {
	// try {
	// await this.getDBVariables();
	// } catch(error) {
	// // showAlert(message.Auth.BE_GET_INFO_FAILURE, 'error');
	// return false;	
	// }
	// },

	async startUp () {
		const tokenExist = appsmith.store.token;

		if (tokenExist) {
			return await navigateTo("申込");
		}

		const code = appsmith.URL.queryParams.code;
		if (!code) {
			return await navigateTo("ログイン");
		}

		try {
			await this.exchangeCodeToToken();
			return await navigateTo("申込");
		} catch(error) {
			// console.log(error);
			await navigateTo("ログイン");
		}
	},

	exchangeCodeToToken: async () => {
		// await this.getEnvInfo();
		const redirectUrl = appsmith.store.DBVariables.redirectUrl;
		try {
			const tokenInfo = await gg_get_token.run({redirectUrl});
			// console.log('----tokenInfo: '+tokenInfo);
			// console.log(tokenInfo);
			//store token and user to appsmith local
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
		const site_code = 'gtn_admin';
		try {
			await add_user_info_to_db.run({email, site_code, token: idToken});
		} catch (error) {
			// console.error("failed to save token to db");
			throw error;
		}
	},
}
