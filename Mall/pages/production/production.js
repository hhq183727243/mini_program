// pages/production/production.js
var ajax = require('../../utils/server');
var app = getApp();

Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		searchFocus: false,//是否获取焦点
		searchKey: '',
		productionList: [],
		pageChosen: 1,
		hasMoreData: true
	},

	bindSearchText: function(){
		this.setData({
			searchFocus: true
		});
	},

	//搜索框失去焦点
	bindSearchBlur: function(e){
		if(e.detail.value.length == 0){
			this.setData({
				searchFocus: false
			});
		}
	},

	//清空内容
	bindClearSearchKey: function(){
		this.setData({
			searchFocus: true,
			searchKey: ''
		});
	},

	bindSearchCancel: function(){
		this.setData({
			searchFocus: false,
			searchKey: ''
		});
	},

	//获取商品列表
	getProductList: function (pageChosen){
		var sortField = 'displayIndex';

		ajax.postJSON('/production/list.do', {
			sellerId: app.globalData.sellerId,
			column1: 'production',
			thirdType: this.data.searchKey,
			sortField: sortField,
			sortType: sortField == 'displayIndex' ? 'ASC' : 'DESC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: pageChosen,
			pageTotal: 20
		}, (res) => {
			wx.hideLoading();
			wx.stopPullDownRefresh();

			let list = res.data.list;

			if (pageChosen == 1) {
				this.setData({
					pageChosen: pageChosen,
					productionList: list,
					hasMoreData: res.data.pageCount > pageChosen
				});
			} else {
				this.setData({
					pageChosen: pageChosen,
					productionList: this.data.list.concat(list),
					hasMoreData: res.data.pageCount > pageChosen
				});
			}
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var searchKey = options.searchKey || '';

		this.setData({
			searchKey: searchKey,
			searchFocus: !!searchKey,
		});

		app.getDefaultSeller(() => {
			this.getProductList(1);
		});
	},

	
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		app.getDefaultSeller(() => {
			this.getProductList(1);
		});
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if (this.data.hasMoreData) {
			this.getProductList(this.data.pageChosen + 1);
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})