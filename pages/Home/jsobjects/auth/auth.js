export default {
	async test () {
		// await storeValue('user','asd')
		// await	clearStore();

	},
	async startUp () {
		//run tuan tu
		await helper.dataOfTreeSelect()

		try{
			const isTokenValid =	await this.isTokenValid()
			if (!isTokenValid){ 
				// await this.logout()
				showAlert(message.Error.LOGOUT_SUCCESS,'error')}
		}catch(error){
			showAlert('Error: '+error.message, 'error')
		}
	},

	logout:async () =>{
		if (appsmith.store.token !== undefined){
			return await delete_token_in_db.run()	
				.then(clearStore())
				.then(() => navigateTo('Login'))
				.catch((error)=>{'Error: '+error.message, 'error' }); 
		}
		else {
			await clearStore()
			navigateTo('Login')
		}
	},

	checkGoogleCert: async (kid) => {
		await get_google_pem_cert.run()
		const response = get_google_pem_cert.data
		const keyIds = Object.keys(response);
		for (let keyId of keyIds) {
			if (kid === keyId ) {
				return true;
			}
		}
		return false;
	},

	isTokenValid: async () => {
		const tokenInfo = appsmith.store.token;
		const token = tokenInfo.id_token;

		const GOOGLE_CLIENT_ID = '1048593421849-fj7f1l3pfoq3h2gcl312v1n149fgp1b7.apps.googleusercontent.com'
		const GOOGLE_ISSUER=  'https://accounts.google.com'

		try {
			const decodedToken = await jsonwebtoken.decode(token, { complete: true });
			if (!decodedToken) {
				return false;
			}
			const kid = decodedToken.header.kid

			//------ HEADER CHECK -----//
			const isHeaderValid =await this.checkGoogleCert( kid)
			if (!isHeaderValid || decodedToken.header.alg !== 'RS256' ){
				return false
			}

			//-- PAYLOAD CHECK --//
			const isSameIss = decodedToken.payload.iss === GOOGLE_ISSUER
			const isSameAud = decodedToken.payload.aud === GOOGLE_CLIENT_ID

			return isSameIss && isSameAud
		} catch (error) {
			console.error('error with this token', error);
			return false;
		}
	},

};
