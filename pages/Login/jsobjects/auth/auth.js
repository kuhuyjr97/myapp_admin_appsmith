export default {

	async loginChooseAccount() {

		const clientId = '1048593421849-fj7f1l3pfoq3h2gcl312v1n149fgp1b7.apps.googleusercontent.com';
		const redirectUrl = 'https://app.appsmith.com/app/untitled-application-1/exchangetoken-65feb03501a5d95cc78a38c6/edit/widgets/z0vfglh6yt?branch=staging';

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

		if (tokenInfo && "id_token" in tokenInfo) {
			navigateTo("Home");
		}
	},
};
