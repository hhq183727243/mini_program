//获取应用实例
var app = getApp()
Page({
	data: {
		setScreenBrightness: false,
		loginStatus: false,
		userInfo: {}
	},
	//页面分享
	onShareAppMessage: function () {
		return {
			title: '居装网',
			desc: '厦门居装网络科技有限公司免费专业顾问服务',
			path: '/pages/index3/index3'
		}
	},
	onLogin: function (res) {
		//调用登录接口
		var that = this;

		wx.getSetting({
			success(res) {
				if (!res.authSetting['scope.userInfo']) {
					wx.authorize({
						scope: 'scope.userInfo',
						success(res) {
							// 用户已经同意，后续调用 wx.getUserInfo 接口不会弹窗询问
							app.getSessionId(this.initUserInfo);
						},
						fail: function (res) {
							wx.openSetting({
								success: (res) => {
									console.log(res);
								}
							})
						}
					});
				} else {
					app.getSessionId(that.initUserInfo);
				}
			}
		})
	},
	initUserInfo: function () {
		var that = this;

		var userInfo = app.globalData['userInfo'];

		this.setData({
			userInfo: userInfo,
			loginStatus: app.globalData['loginStatus']
		});
	},

	//调整屏幕亮度
	switch1Change: function (e) {
		var val = e.detail.value;

		if (val) {
			wx.setScreenBrightness({ value: 0 });
		} else {
			wx.setScreenBrightness({ value: 0.5 })
		}
	},

	onLoad: function (options) {
		if (wx.canIUse('setScreenBrightness')) {
			this.setData({
				setScreenBrightness: true
			});
		}
	},
	onShow: function () {
		this.initUserInfo();
	}
})
