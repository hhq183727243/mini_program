// pages/user/myCollected/myCollected.js
var ajax = require('../../../utils/server.js');
var app = getApp();

Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		list: [],
		pageChosen: 1
	},

	getMycollected: function (pageChosen){
		ajax.postJSON('/collection/list.do',{
			relatedTable: 'Production',
			pageChosen: pageChosen,
			pageTotal: 20
		},(res) => {
			if(200 == res.data.status){
				wx.stopPullDownRefresh();

				let list = res.data.data.list;
				
				if (1 == pageChosen){
					this.setData({
						pageChosen: pageChosen,
						hasMoreData: list.length >= 20,
						list: list
					});
				}else{
					this.setData({
						pageChosen: pageChosen,
						hasMoreData: list.length >= 20,
						list: this.data.list.concat(list)
					});
				}
			}
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getMycollected(1);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.getMycollected(1);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		this.getMycollected(this.data.pageChosen + 1);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})