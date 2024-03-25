export default {
	createToken : (token) =>{
		const secret = 'tranbahuy123'
		return jsonwebtoken.sign({token}, secret, {expiresIn: 1},{ algorithm: 'RS256' });
	},

	decodeToken : (token) =>{
		const secret = 'tranbahuy123'
		const decoded = jsonwebtoken.decode(token, secret);
		return decoded;
	},

	async	test(){
		const password = 'importReact123'
		const text = this.createText(password)
		// const text = this.getText('')
		return text
	},


	async createText (text){
		const objV4 = UUID.genV4();
		const hexNhat =  objV4.hexString.slice(0,10)
		const hexNhi =  objV4.hexString.slice(10)
		const hexTam= objV4.hexNoDelim //32

		const nhat = text.slice(0,4)
		const nhi = text.slice(4,7)
		const tam = text.slice(7)

		const combinedText = hexNhi + nhi +hexTam +tam+ nhat+ hexNhat
		const reversedText = combinedText.split('').reverse().join('')
		const token = this.createToken(reversedText)
		return combinedText
	},

	async getText (){
		const text ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjVhOGUwYWU2MjlkOTk4NzY1NC00ZGVhLTc3YWNiYTYtNWFmYzFlYjM1YThlMGFlNjI5ZDkzMjE0LTBjMyIsImlhdCI6MTcxMTI5NjY5NCwiZXhwIjoxNzExMjk2Njk1fQ.7A9VvSMPZUxfVQyygW5yCHKT9Pj2svt4jF4m-mWOqPo'
		const decodeToken=	this.decodeToken(text)
		// const token = decodeToken.token.split('').reverse().join('')
		const token = '8ac-4065-9350-66a603b3b829rtRf268937588ac4065935066a603b3b829eact123impof2689375-8'
		const nhat = token.slice(-14,-10)
		const nhi = token.slice(26,29)
		const tam = token.slice(61,-14)
		const okText = nhat + nhi +tam
		return okText

	},


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