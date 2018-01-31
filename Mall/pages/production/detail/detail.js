// pages/production/detail/detail.js
var app = getApp()
var ajax = require('../../../utils/server');
var WxParse = require('../../../wxParse/wxParse.js');

Page({
	data: {
		loginStatus: false, //登录状态
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		baseUrl: app.globalData.baseUrl,
		isCollected: false, //是否收藏
		isShowPanel: false, //是否立即购买
		screenWidth: app.screenWidth,
		buyNumber: 1,
		currentIndex: 0,
		entity: {
			picture: 'images/default.jpg'
		},//商品实体
		attachmentList: []
	},

	showPanel: function(){
		this.setData({
			isShowPanel: true
		});
	},
	hidePanel: function(){
		this.setData({
			isShowPanel: false
		});
	},

	//获取商品详细
	getEntityDetail: function(id){
		ajax.postJSON('/production/detail.do', {
			id: id
		}, (res) => {
			this.setData({
				entity: res.data.data
			});

			WxParse.wxParse('article', 'html', this.data.entity['synopsis'], this, 0);
		});
	},

	getAttachmentList: function (id) {
		ajax.postJSON('/attachment/list.do', {
			relatedTable: 'Production',
			relatedDataId: id
		}, (res) => {
			this.setData({
				attachmentList: res.data.list
			});
		});
	},
	
	//是否收藏
	bindToggleConllect: function () {
		let isCollected = this.data.isCollected;

		ajax.postJSON('/collection/' + (isCollected ? 'delete' : 'add') + '.do', {
			relatedTable: 'Production',
			relatedDataId: this.data.id
		}, (res) => {
			if (isCollected) {
				this.data.entity.collectionNumber = this.data.entity.collectionNumber - 1;
			} else {
				this.data.entity.collectionNumber = this.data.entity.collectionNumber + 1;
			}

			this.setData({
				isCollected: !isCollected,
				entity: this.data.entity
			});

			wx.showToast({
				title: this.data.isCollected ? '收藏成功' : '已取消收藏'
			});
		});
	},

	//是否收藏
	checkIsCollected: function () {
		ajax.postJSON('/collection/is_collected.do', {
			relatedTable: 'Production',
			relatedDataId: this.data.id
		}, (res) => {
			this.setData({
				isCollected: res.data.data
			});
		});
	},

	//登录授权
	bindgetuserinfo: function (e) {
		if (e.detail.userInfo != undefined) {
			wx.setStorageSync('userInfo', e.detail.userInfo);

			app.getSessionId(() => {
				this.setData({
					loginStatus: true
				});

				this.checkIsCollected();
			});
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let id = options.id || '';

		this.setData({
			id: id,
			loginStatus: app.globalData.loginStatus
		});

		this.getEntityDetail(id);
		this.getAttachmentList(id);

		//判断是否已登录
		if (app.globalData.loginStatus) {
			this.checkIsCollected();
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})