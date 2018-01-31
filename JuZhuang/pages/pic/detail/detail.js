// pages/pic/detail/detail.js
var ajax = require('../../../utils/server.js');
var app = getApp();

Page({
	data: {
		loginStatus: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		baseUrl: app.globalData.baseUrl,
		id: '',
		isCollected: false,//是否已收藏
		product: {
			name: '加载中...',
			readNumber: 0,
			collectionNumber: 0
		},
		swiperIndex: 0,//swiper 当前页数
		attachmentList: []
	},

	getProductDetail: function(){
		ajax.postJSON('/production/detail.do',{
			id: this.data.id
		},(res) => {
			this.setData({
				product: res.data.data.data
			});
		});
	},

	getAttachmentList: function(){
		ajax.postJSON('/attachment/list.do', {
			relatedTable: 'Production',
			relatedDataId: this.data.id
		}, (res) => {
			this.setData({
				attachmentList: res.data.data.list
			});
		});
	},

	//swiper 切换
	bindSwiperChange: function(e){
		var index = e.detail.current;
		this.setData({
			swiperIndex: index
		});
	},

	bindToggleConllect: function(){
		let isCollected = this.data.isCollected;

		ajax.postJSON('/collection/' + (isCollected ? 'delete' : 'add') + '.do', {
			relatedTable: 'Production',
			relatedDataId: this.data.id
		}, (res) => {
			if (isCollected){
				this.data.product.collectionNumber = this.data.product.collectionNumber - 1;
			}else{
				this.data.product.collectionNumber = this.data.product.collectionNumber + 1;
			}

			this.setData({
				isCollected: !isCollected,
				product: this.data.product
			});

			wx.showToast({
				title: '操作成功',
			});
		});
	},

	checkIsCollected: function(){
		ajax.postJSON('/collection/is_collected.do', {
			relatedTable: 'Production',
			relatedDataId: this.data.id
		}, (res) => {
			this.setData({
				isCollected: res.data.data.data
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

		this.getProductDetail();
		this.getAttachmentList();

		//判断是否已登录
		if (app.globalData.loginStatus) {
			this.checkIsCollected();
		}
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