var ajax = require('../../utils/server.js');
var selectAddress = require('../selectAddress/selectAddress.js');

var app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		baseUrl: app.globalData.baseUrl,
		show: false,
		entity: {},
		list: []
	},

	showForm: function(){
		this.toggleForm(true)
	},
	hideForm: function () {
		this.toggleForm(false)
	},
	toggleForm: function(flag){
		this.setData({
			show: flag
		});
	},
	//获取活动背景图片
	getAttachmentList: function(){
		ajax.postJSON('/attachment/list.do', {
			relatedTable: 'ProductionDiscount',
			relatedDataId: 'ProductionDiscount',
			column1: 1
		}, (res) => {
			var list = res.data.data.list;

			if (list.length > 0){
				this.setData({
					entity: list[0],
					list: list
				});
			}
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

		submitData.userId = app.globalData.sellerId;
		submitData.country = '中国';
		submitData.type = 0;
		submitData.province = this.data.region[0];
		submitData.city = this.data.region[1];
		submitData.district = this.data.region[2];
		submitData.sourceType = 3;

		ajax.postJSON('/address/add.do', submitData, (res) => {
			wx.showModal({
				title: '报名成功',
				content: '我们将会在稍后给您致电请耐心等待',
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
		selectAddress.initAddress.apply(this, [selectAddress]);

		this.getAttachmentList();

		if (app.globalData.sellerId == '') {
			ajax.postJSON('/seller/detail_default.do', (res) => {
				app.globalData.sellerId = res.data.data.data.id;
			});
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})