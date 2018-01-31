//index.js
var app = getApp()
var ajax = require('../../utils/server');

Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		banner: ['banner_1.jpg', 'banner_2.jpg', 'banner_3.jpg','banner_4.jpg'],
		latestList: []
	},

	//获取新品上线产品
	getLatestProductionList: function(){
		ajax.postJSON('/production/list.do', {
			sellerId: app.globalData.sellerId,
			column1: 'production',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: 1,
			pageTotal: 6
		}, (res) => {
			this.setData({
				latestList: res.data.list
			});
		});
	},

	//页面分享
	onShareAppMessage: function () {
		return {
			title: '迅康图片案例',
			desc: '分享交流医学图片病例，帮助医生进行教学、诊断和学术交流等活动',
			path: '/pages/index/index'
		}
	},
	onLoad: function (options) {
		app.getDefaultSeller(() => {
			this.getLatestProductionList();
		});
	}
})
