// pages/user/aboutUs/message/message.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		wordsNumber: 0,
	},
	
	bindinput: function(e){
		
		this.setData({
			wordsNumber: e.detail.value.length
		})
	},

	formSubmit: function(e){
		console.log(e.detail.value);
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})