var ajax = require('../../../utils/server');
var app = getApp();

Page({
	data: {
		id: '',
		addressList: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
	},

	getAddressList: function(){
		ajax.postJSON('/address/list.do', {
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: 1,
			pageTotal: 10
		}, (res) => {
			console.log(res);
		});
	},

	//从微信获取地址
	getAddressFromWechat: function(){
		// 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.address" 这个 scope
		wx.getSetting({
			success: (res) => {
				if (!res.authSetting['scope.address']) {
					wx.authorize({
						scope: 'scope.address',
						success: () => {
							// 用户已经同意小程序获取微信地址，后续调用 wx.chooseAddress 接口不会弹窗询问
							wx.chooseAddress()
						}
					})
				}
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getAddressList()
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