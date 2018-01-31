// pages/user/address/add/add.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		region: ['省','市','区/县'],
		address: {}
	},

	bindRegionChange: function(e){
		this.setData({
			region: e.detail.value
		});
	},

	validate: function(formValue){
		var result = true,
			required = ['name', 'tel','addressDetail'],
			errTip = ['请输入姓名','请输入手机号码','请输入详细地址'];

		if (this.data.region[0] == '省'){
			wx.showToast({
				title: '请选择地区',
				image: '../../../../images/icon/warn.png',
				duration: 2000
			});

			result = false;
		}else{
			required.forEach((item,index) => {
				if (formValue[item].trim() == '' && result){
					wx.showToast({
						title: errTip[index],
						image: '../../../../images/icon/warn.png',
						duration: 2000
					});

					result = false;
				}
			});
		}
		
		return result;
	},

	formSubmit: function (e) {
		console.log(e.detail.value);

		this.validate(e.detail.value);
	},

	getAddressDetail: function(id){
		this.setData({
			address: {
				name: '刘德华',
				tel: '15289939882',
				detail: '火炬高新区软件园一期创新大厦B区202室'
			}
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var id = options.id;

		if (id != undefined) {
			wx.setNavigationBarTitle({
				title: '编辑收获地址'
			});

			//获取地址详细
			this.getAddressDetail(id);
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})