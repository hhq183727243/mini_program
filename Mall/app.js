//app.js
var ajax = require('./utils/server');

App({
	globalData: {
		seller: {},
		sellerId: '',
		//appid: '居装小程序wx8aad63180dfa21f8',c19f8b444bbc48fea5c2d9d4d8f03c3c
		baseUrl: 'http://www.hhq.com/TravelTicket/',
		header: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Cookie': ''
		},
		header2: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Cookie': '',
			'X-Requested-With': 'XMLHttpRequest'
		},
		loginStatus: false,
		openId: '',
		userInfo: {},
		sessionId: '',
	},

	errorCallback: function (res) {
		var that = this;

		var tip = ('string' == typeof (res)) ? res : (res.data['data'] || '系统繁忙，请稍后再试...');

		wx.showModal({
			title: '提示',
			content: tip,
			showCancel: false,
			success: function (_res) {
				if (_res.confirm) {
					if ('用户未登录' == res.data['data'] || 'loginError' == res.data['data']) {
						that.globalData.loginStatus = false;
						that.globalData.userInfo = {};

						wx.switchTab({
							url: '/pages/user/user'
						})
					}
				}
			}
		});
	},

	//获取sessionId
	getSessionId: function (callback) {
		var that = this;

		//获取sessionId
		wx.request({
			url: that.globalData['baseUrl'] + 'system/session_id.do',
			method: 'POST',
			//header: that.globalData.header,
			success: function (res) {
				if (200 === res.data['status']) {
					let sessionId = res.data.data.data;

					that.globalData['sessionId'] = sessionId;
					that.globalData.header['Cookie'] = 'JSESSIONID=' + sessionId;
					that.globalData.header2['Cookie'] = 'JSESSIONID=' + sessionId;
					that.wechatLogin(callback);
				}
			}
		});
	},

	wechatLogin: function (callback) {
		var that = this,
			userInfo = {};

		var systemLogin = function (postData) {
			wx.showLoading({
				title: '登录中...'
			});

			wx.request({
				url: that.globalData.baseUrl + 'user/login_wechat.do',
				method: 'POST',
				data: postData,
				header: that.globalData.header,
				success: function (res) {
					wx.hideLoading();
					if (200 == res.data.status) {
						//that.globalData.openId = postData.openId;
						that.globalData.userInfo = wx.getStorageSync('userInfo');
						that.globalData.loginStatus = true;

						if (typeof callback == 'function') {
							callback();
						}
					}
				}
			});
		};

		//获取access_token
		var loginCallback = function (code, userInfo) {
			wx.setStorageSync('userInfo', userInfo);

			systemLogin({
				code: code,
				userInfoJson: JSON.stringify(userInfo),
			});
		};

		//调用登录接口
		wx.login({
			success: function (res) {
				var userInfo = wx.getStorageSync('userInfo'),
					code = res.code;

				if (userInfo) {
					loginCallback(code, userInfo);
				} else {
					wx.getUserInfo({
						success: function (res) {
							loginCallback(code, res.userInfo);
						}
					});
				}
			}
		});
	},

	//获取默认商家
	getDefaultSeller: function (callback) {
		if (this.globalData.sellerId == '') {
			ajax.postJSON('/seller/detail_default.do', (res) => {
				this.globalData.seller = res.data.data;
				this.globalData.sellerId = res.data.data.id;

				callback();
			});
		}else{
			callback();
		}
	},

	initData: function () {
		var that = this;

		// 设备信息
		wx.getSystemInfo({
			success: function (res) {
				that.screenWidth = res.windowWidth;
				that.pixelRatio = res.pixelRatio;
			}
		});
	},

	//当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
	onLaunch: function () {
		this.initData();

		this.getSessionId();
	}
})