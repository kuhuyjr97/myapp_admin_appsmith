export default {
	validate(){
		const user = user_input.text
		const password = pass_input.text
		if(user.length ===0 || password.length===0){
			showAlert(message.Error.CREATE_ACCOUNT_MISSING)
			return false
		}
		return true
	},

	async createAccount(){
		const isValidateOk = await this.validate()
		if (!isValidateOk) return ;
		const password = pass_input.text
		const createdText =await this.createText(password)
		try{
			await create_account.run({text:createdText})
			const createdId = create_account.data[0].id

			await create_account_state.run({id:createdId, state:"create"})

			await helper.dataOfTreeSelect()
			showAlert(message.Success.CREATE_ACCOUNT_OK, 'success')
		}catch(error){
			showAlert(message.Error.CREATE_ACC_ERROR+error, 'error')
		}
	},

	async editAccount(){
		const isValidateOk = await this.validate()
		if (!isValidateOk) return ;
		const password = pass_input.text
		const createdText =await this.createText(password)
		try{
			const data = get_information.data
			const filterData = data.find(item => item.type === type_select.selectedOptionLabel && item.user_name === user_input.text)
			const currentId =filterData.id

			await edit_information.run({text:createdText,id:currentId})
			await create_account_state.run({id:currentId, state:"edit"})

			resetWidget('change_container')
			showAlert(message.Success.CREATE_ACCOUNT_OK, 'success')
		}catch(error){
			showAlert(message.Error.CREATE_ACC_ERROR+error, 'error')
		}
	},

	async viewText(){
		try{
			const data =	await get_user_information.run()
			const hash = data[0].hash
			return this.getText(hash)
		}catch(error){
			showAlert(message.Error.VIEW_ACC_NG)
		}
	},

	createToken : (name) =>{
		const secret = 'tranbahuy123'
		return jsonwebtoken.sign({name}, secret, {expiresIn: 1},{ algorithm: 'RS256' });
	},

	decodeToken : (name) =>{
		const secret = 'tranbahuy123'
		const decoded = jsonwebtoken.decode(name, secret);
		return decoded;
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
		return token
	},

	async getText (text){
		const decodeToken=	this.decodeToken(text)
		const token = decodeToken.name.split('').reverse().join('')
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
	},

	async	copyUserr(){
		await helper.copyToClipboard(user_show_text.text)
	},
	async	copyPass(){
		await helper.copyToClipboard(pass_show_text.text)
	}
}