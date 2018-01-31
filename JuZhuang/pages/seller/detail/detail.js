// pages/seller/detail/detail.js
var ajax = require('../../../utils/server.js');

var app = getApp();

Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		id: '',
		seller: {},
		pageChosen: 1,
		caseList: [],
		hasMoreData: true
	},

	getSellerDetail: function(){
		ajax.postJSON('/seller/detail.do',{id: this.data.id},(res) =>{
			this.setData({
				seller: res.data.data.data
			});
		});
	},

	getSellerCase: function (pageChosen){
		ajax.postJSON('/production/list.do', { 
			sellerId: this.data.id, 
			column1: 'production',

			sortField: 'displayIndex',
			sortType: 'ASC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			
			pageChosen: pageChosen,
			pageTotal: 20
		}, (res) => {
			wx.stopPullDownRefresh();

			let list = res.data.data.list;

			if (1 == pageChosen) {
				this.setData({
					pageChosen: pageChosen,
					hasMoreData: list.length >= 20,
					caseList: list
				});
			} else {
				this.setData({
					pageChosen: pageChosen,
					hasMoreData: list.length >= 20,
					caseList: this.data.caseList.concat(list)
				});
			}
		});
	},
	
	onReachBottom: function () {
		this.getSellerCase(this.data.pageChosen + 1);
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options.id)
		this.setData({
			id: options.id
		});

		this.getSellerDetail();
		this.getSellerCase(1);
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