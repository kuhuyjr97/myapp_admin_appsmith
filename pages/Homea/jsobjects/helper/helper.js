export default {
	dataOfTreeSelect : async ()=>{
		let treeData = [];
		let yearsMap = {};

		const responseData= await get_information.run()

		responseData.forEach(record => {
			if (!yearsMap[record.type]) {
				yearsMap[record.type] = {
					label: record.type.toString(),
					value: record.type.toString(),
					children: []
				};
				treeData.push(yearsMap[record.type]);
			}
			yearsMap[record.type].children.push({
				label: record.user_name,
				value: record.user_name
			});
		});

		return treeData;

	},


	ACCOUNT_TYPE () {
		return 	[
			{
				"name": "Gmail",
				"code": 0
			},
			{
				"name": "Company",
				"code": 1
			},
			{
				"name": "Indentity",
				"code": 2
			},
			{
				"name": "Icloud",
				"code": 3
			},
			{
				"name": "Camera",
				"code":4
			},
			{
				"name": "Microsoft",
				"code": 5
			},
			{
				"name": "Samsung",
				"code": 6
			},
			{
				"name": "Steam",
				"code": 7
			},
			{
				"name": "Social",
				"code": 8
			},
			{
				"name": "Bank",
				"code": 9
			}
		]
	},

	copyToClipboard(string) {
		copyToClipboard(string);
		showAlert(message.Success.COPY_OK);
	},

}