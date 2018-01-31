var ajax = require('../../utils/server.js');
var selectAddress = require('../selectAddress/selectAddress.js');

var app = getApp();

Page({
	data: {
		animationData: {}
	},

	numAnimate: function(){
		var animation = wx.createAnimation({
			duration: 600,
			timingFunction: 'ease',
		});


		this.animation = animation

		animation.scale(1.5, 1.5).step();

		this.setData({
			animationData: animation.export()
		})

		var flag = 1; 

		this.interval = setInterval(()=>{
			var scale = flag % 2 == 1 ? 1 : 1.5;

			animation.scale(scale, scale).step();

			this.setData({
				animationData: animation.export()
			})

			flag++
		},600);
	},

	formSubmit: function (e) {
		var submitData = e.detail.value;

		if (submitData.contact == ''){
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
		submitData.sourceType = 2;

		ajax.postJSON('/address/add.do', submitData, (res) => {
			wx.showModal({
				title: '申请成功',
				content: '装修顾问将会在稍后给您致电请耐心等待',
				showCancel: false,
				confirmText: '我知道了',
				success: function(res){
					if (res.confirm){
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
		this.numAnimate();
		selectAddress.initAddress.apply(this, [selectAddress]);

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