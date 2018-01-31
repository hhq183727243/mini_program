// pages/addUserInfo/addUserInfo.js
var ajax = require('../../utils/server.js');
var selectAddress = require('../selectAddress/selectAddress.js');

var app = getApp();

Page({
	data: {
		styleShow: false,
		styleV: [0, 0, 0, 0, 0],
		styleSelected: [0,0,0,0,0],
		list1: ['1室', '2室', '3室', '4室', '5室', '6室'],
		list2: ['1厅', '2厅', '3厅', '4厅'],
		list3: ['1厨', '2厨', '3厨', '4厨'],
		list4: ['1卫', '2卫', '3卫', '4卫', '5卫', '6卫'],
		list5: ['1阳台', '2阳台', '3阳台', '4阳台'],

		jisuanqi: '54158',
		interval: null 
	},

	handleTap: function(){},

	changeNum: function(){
		var num = this.data.jisuanqi;

		this.data.interval = setInterval(() => {
			var newNum = Math.floor(Math.random() * 100000) + '';

			this.setData({
				jisuanqi: newNum
			});
		},500); 
	},

	formSubmit: function(e){
		var submitData = e.detail.value;

		if (submitData.contact == '') {
			wx.showModal({
				content: '请输入您的姓名',
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

		if (this.data.region[0] == '省') {
			wx.showModal({
				content: '请选择地区',
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

		var arr = this.data.styleSelected;

		submitData.userId = app.globalData.sellerId;
		submitData.country = '中国';
		submitData.type = 0;
		submitData.province = this.data.region[0];
		submitData.city = this.data.region[1];
		submitData.district = this.data.region[2];
		submitData.sourceType = 1;
		submitData.column1 = this.data.list1[arr[0]] + this.data.list2[arr[1]] + this.data.list3[arr[2]] + this.data.list4[arr[3]] + this.data.list5[arr[4]]
		
		ajax.postJSON('/address/add.do', submitData,(res) => {
			wx.showModal({
				title: '提交成功',
				content: '友情提示，因材料品牌及工程质量不同，具体报价以量房实测为准，稍后装修管家将回电您，免费提供装修咨询服务',
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

	showStyleSelect: function(){
		this.setData({
			styleShow: true
		});
	},
	cancelStyle: function(){
		this.setData({
			styleShow: false
		});
	},
	selectStyle: function () {
		this.setData({
			styleShow: false,
			styleSelected: this.data.styleV
		});
	},
	bindStyleChange: function(e){
		this.data.styleV = e.detail.value;
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.changeNum();
		selectAddress.initAddress.apply(this, [selectAddress]);
		
		if (app.globalData.sellerId == '') {
			ajax.postJSON('/seller/detail_default.do', (res) => {
				app.globalData.sellerId = res.data.data.data.id;
			});
		}
	},

	onHide: function(){
		clearInterval(this.data.interval);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})