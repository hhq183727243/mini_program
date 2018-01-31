//index.js
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
	data: {
		currentIndex: 0,
		banner: ['j_banner_1.jpg', 'j_banner_2.jpg', 'j_banner_3.jpg'],
		demoList: [1,2,3,4]
	},
	//导航切换
	changeTab: function (event) {
		var index = event.currentTarget.dataset.index;
		this.setData({
			currentIndex: index
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

	}
})
