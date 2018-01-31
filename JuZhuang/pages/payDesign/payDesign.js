// pages/seller/detail/detail.js
var ajax = require('../../utils/server.js');
var selectAddress = require('../selectAddress/selectAddress.js');

var app = getApp();

Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		id: '',
		seller: {}
	},
	handleTap: function () { },
	getSellerDetail: function () {
		ajax.postJSON('/seller/detail.do', { id: this.data.id }, (res) => {
			this.setData({
				seller: res.data.data.data
			});
		});
	},

	formSubmit: function (e) {
		var submitData = e.detail.value;

		if (submitData.contact == '') {
			wx.showModal({
				content: '请输入您的姓名',
				showCancel: false
			});
			return;
		}

		var partten = /^1[3,4,5,8,9]\d{9}$/;

		if (submitData.mobilephone == '' || !partten.test(submitData.mobilephone)) {
			wx.showModal({
				content: '请输入正确手机号',
				showCancel: false
			});
			return;
		}

		if (this.data.region[0] == '省') {
			wx.showModal({
				content: '请选择地区',
				showCancel: false
			});
			return;
		}

		if (submitData.detail == '') {
			wx.showModal({
				content: '请输入房屋面积',
				showCancel: false
			});
			return;
		}

		submitData.userId = app.globalData.sellerId;
		submitData.country = '中国';
		submitData.type = 0;
		submitData.province = this.data.region[0];
		submitData.city = this.data.region[1];
		submitData.district = this.data.region[2];
		submitData.sourceType = 4;
		submitData.column4 = this.data.id;//合作商家id

		ajax.postJSON('/address/add.do', submitData, (res) => {
			wx.showModal({
				title: '申请成功',
				content: '装修顾问将会在稍后给您致电请耐心等待',
				showCancel: false,
				confirmText: '我知道了',
				success: function (res) {
					if (res.confirm) {
						wx.navigateBack({
							delta: 1
						});
					}
				}
			});
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			id: options.id
		});

		selectAddress.initAddress.apply(this, [selectAddress]);

		if (app.globalData.sellerId == '') {
			ajax.postJSON('/seller/detail_default.do', (res) => {
				app.globalData.sellerId = res.data.data.data.id;
			});
		}

		this.getSellerDetail();
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '居装网',
			desc: '厦门居装网络科技有限公司免费专业顾问服务',
			path: '/pages/index3/index3'
		}
	}
})