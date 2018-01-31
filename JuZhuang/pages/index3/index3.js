// pages/index3/index3.js
var ajax = require('../../utils/server');
var app = getApp();
Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		banner: [],
		pCurretnIndex: 0,
		pList: [],
		aCurretnIndex: 0,
		aList: []
	},
	getBannerList: function(){
		ajax.postJSON('/production/list.do', {
			sellerId: app.globalData.sellerId,
			column1: 'banner',
			sortField: 'displayIndex',
			sortType: 'ASC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: 1,
			pageTotal: 10
		}, (res) => {
			let result = res.data;
			let list = result.data.list;
			
			wx.stopPullDownRefresh();

			this.setData({
				banner: list
			})
		});
	},
	getProductList: function () {
		ajax.postJSON('/production/list.do', {
			sellerId: app.globalData.sellerId,
			column1: 'production',
			type: 'homeProduct',
			sortField: 'displayIndex',
			sortType: 'ASC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: 1,
			pageTotal: 15
		}, (res) => {
			let result = res.data;
			let list = result.data.list,
				a = [],
				b = [],
				c = [];

			list.forEach((item, index) => {
				switch (item.module) {
					case 'kj': a.push(item); break;
					case 'fg': b.push(item); break;
					case 'hx': c.push(item); break;
				}
			});

			this.setData({
				pList: [a, b, c]
			})
		});
	},

	getArticleList: function (){
		ajax.postJSON('/article/list.do',{
			userId: app.globalData.sellerId,
			type: 'homeArticle',
			sortField: 'displayIndex',
			sortType: 'ASC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: 1,
			pageTotal: 15
		},(res) => {
			let result = res.data;

			if (200 == result.status){
				let list = result.data.list,
					a = [],
					b= [],
					c = [];

				list.forEach((item,index) => {
					switch (item.module){
						case '1': a.push(item);break;
						case '2': b.push(item); break;
						case '3': c.push(item); break;
					}
				});

				this.setData({
					aList : [a,b,c]
				})
			}
		});
	},

	bindChangeProductTab: function(e){
		var idx = e.currentTarget.dataset.idx;

		this.setData({
			pCurretnIndex: idx
		});
	},

	bindChangeArticleTab: function (e) {
		var idx = e.currentTarget.dataset.idx;

		this.setData({
			aCurretnIndex: idx
		});
	},
	initData: function(){
		if (app.globalData.sellerId == '') {
			ajax.postJSON('/seller/detail_default.do', (res) => {
				app.globalData.seller = res.data.data.data;
				app.globalData.sellerId = res.data.data.data.id;

				this.getArticleList();
				this.getProductList();
				this.getBannerList();
			});
		} else {
			this.getArticleList();
			this.getProductList();
			this.getBannerList();
		}
	},
	onPullDownRefresh: function(){
		this.initData();
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//加载商家信息
		this.initData();
	},
	
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '居装网',
			desc: '厦门居装网络科技有限公司免费专业顾问服务',
			path: '/pages/index3/index3'
		}
	}
})