// pages/article/article.js
var ajax = require('../../utils/server.js');
var app = getApp();

Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		currentIndex: 0,
		modules: ['1','2','3'],
		list: [],//精选文章
		allList: [],//所有文章
		pageChosen: 1,
		hasMoreArticle: true
	},

	//获取所有文章
	getArticleList: function (moduleName, pageChosen){
		wx.showLoading({
			title: '加载中...'
		});

		ajax.postJSON('/article/list.do',{
			userId: app.globalData.sellerId,
			module: moduleName,
			sortField: 'displayIndex',
			sortType: 'ASC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: pageChosen,
			pageTotal: 20
		},(res) => {
			var result = res.data;

			if (1 == pageChosen){
				this.getSelectArticleList(moduleName);

				this.setData({
					pageChosen: pageChosen,
					allList: result.data.list,
					hasMoreArticle: result.data.list.length >= 20
				});

				wx.stopPullDownRefresh();
			}else{
				this.setData({
					pageChosen: pageChosen,
					allList: this.data.allList.concat(result.data.list),
					hasMoreArticle: result.data.list.length >= 20
				});
			}

			wx.hideLoading();
		});
	},
	
	//获取精选文章
	getSelectArticleList: function (moduleName) {
		ajax.postJSON('/article/list.do', {
			userId: app.globalData.sellerId,
			module: moduleName,
			sortField: 'readNumber',
			sortType: 'DESC',//降序
			pageChosen: 1,
			pageTotal: 5
		}, (res) => {
			let result = res.data;

			this.setData({
				list: result.data.list
			});
		});
	},

	//加载更多
	bindLoadMore: function(){
		var pageChosen = this.data.pageChosen + 1;

		this.getArticleList(this.data.modules[this.data.currentIndex], pageChosen);
	},

	//切换文章类型
	bindChangeArticleTab: function (e) {
		var idx = e.currentTarget.dataset.idx;

		this.setData({
			pageChosen: 1,
			currentIndex: idx
		});

		this.getArticleList(this.data.modules[idx], this.data.pageChosen);
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var idx = options.currentIndex || 0;

		this.setData({
			currentIndex: parseInt(idx,10)
		});
		
		let moduleName = this.data.modules[parseInt(idx, 10)];

		this.getArticleList(moduleName, this.data.pageChosen);

		//this.getSelectArticleList(moduleName);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		let moduleName = this.data.modules[this.data.currentIndex];

		this.getArticleList(moduleName, 1);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})