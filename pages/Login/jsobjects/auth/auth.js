export default {

	async loginChooseAccount() {
	
		const clientId = appsmith.store.DBVariables.clientId;
		const redirectUrl = appsmith.store.DBVariables.redirectUrl;

		await get_google_pem_cert.run();
		const googlePemCertificateData = get_google_pem_cert.data;
		await storeValue("googlePemCertificate", googlePemCertificateData);

		let url =
				"https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=code&client_id=" +
				clientId +
				"&redirect_uri=" +
				redirectUrl +
				"&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile";
		await navigateTo(url);
	},

	async startUp() {
		const tokenInfo = appsmith.store.token;
		const DBVariables = appsmith.store.DBVariables;
		if (!DBVariables) {
			removeValue("DBVariables")
		}
		if (tokenInfo && "id_token" in tokenInfo) {
			navigateTo("申込");
		}
	},
};
