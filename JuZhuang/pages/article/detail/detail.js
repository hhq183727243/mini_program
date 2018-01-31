// pages/article/detail/detail.js
var ajax = require('../../../utils/server.js');
var WxParse = require('../../../wxParse/wxParse.js');

Page({
	data: {
		id : '',
		article: {
			title: '加载中..',
			content: '加载中..',
			readNumber: 0,
			datetime: '2017-01-01 00：00：01'
		}
	},

	getArticleDetail: function(){
		wx.showLoading({
			title: '加载中...'
		});

		ajax.postJSON('/article/detail.do',{
			id: this.data.id
		},(res) => {
			let result = res.data;

			this.setData({
				article: result.data.data
			});

			WxParse.wxParse('content', 'html', result.data.data['content'], this, 15);

			wx.hideLoading();
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let id = options.id || '';

		this.setData({
			id
		});

		this.getArticleDetail();
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})