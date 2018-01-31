// pages/user/aboutUs/aboutUs.js
var ajax = require('../../../utils/server.js');
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		seller: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (app.globalData.seller.id == undefined) {
			ajax.postJSON('/seller/detail_default.do', (res) => {
				this.setData({
					seller: res.data.data.data
				});

				WxParse.wxParse('content', 'html', this.data.seller.synopsis.replace(/\n/g, '<div></div>'), this, 15);
			});
		} else {
			this.setData({
				seller: app.globalData.seller
			});

			WxParse.wxParse('content', 'html', this.data.seller.synopsis.replace(/\n/g, '<div></div>'), this, 15);
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})