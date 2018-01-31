// pages/pic/detail/detail.js
var ajax = require('../../utils/server.js');
var app = getApp();

Page({
	data: {
		loginStatus: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		baseUrl: app.globalData.baseUrl,
		id: '',
		isCollected: false,//是否已收藏
		caseList: [],
		product: {
			name: '加载中...',
			readNumber: 0,
			collectionNumber: 0
		},
		currentIndex: 0,//与swiperIndex一样，这个每次切换时需要setData
		swiperIndex: 0,//swiper 当前页数
		queryCondition: [],
		pageChosen: 1,
		hasMoreData: true
	},

	getProductDetail: function (id) {
		ajax.postJSON('/production/detail.do', {
			id: id
		}, (res) => {
			this.setData({
				product: res.data.data.data
			});
		});
	},

	getCaseList: function (pageChosen) {
		var queryCondition = app.globalData.queryCondition;

		ajax.postJSON('/production/list.do', {
			sellerId: app.globalData.sellerId,
			column1: 'production',

			secondType: queryCondition[1],//空间
			thirdType: queryCondition[2],//风格
			childModule: queryCondition[3],//户型
			location: queryCondition[4],//面积
			column3: 'case',
			sortField: queryCondition[0],
			sortType: queryCondition[0] == 'displayIndex' ? 'ASC' : 'DESC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: 1,
			pageTotal: 20 * pageChosen
		}, (res) => {
			var list = res.data.data.list;

			this.setData({
				pageChosen: pageChosen,
				caseList: list,
				product: list[this.data.swiperIndex],
				hasMoreData: res.data.data.pageCount > 1
			});

			wx.hideLoading();
		});
	},

	//swiper 切换
	bindSwiperChange: function (e) {
		var index = e.detail.current;

		// 如果在 bindchange 的事件回调函数中使用 setData 改变 current 值，
		// 则有可能导致 setData 被不停地调用，
		// 因而通常情况下请不要这样使用
		this.data.swiperIndex = index;

		this.setData({
			id: this.data.caseList[index].id,
			currentIndex: index,
			product: this.data.caseList[index]
		});

		if (index == this.data.caseList.length - 1 && this.data.hasMoreData){
			this.getCaseList(this.data.pageChosen + 1);
		}

		//更新浏览数
		this.getProductDetail(this.data.caseList[index].id);
		
		//判断是否已登录
		if (app.globalData.loginStatus){
			this.checkIsCollected(this.data.caseList[index].id);
		}
	},

	bindToggleConllect: function (e) {
		let id = e.currentTarget.dataset.id,
			isCollected = this.data.isCollected;

		ajax.postJSON('/collection/' + (isCollected ? 'delete' : 'add') + '.do', {
			relatedTable: 'Production',
			relatedDataId: id
		}, (res) => {
			if (isCollected) {
				this.data.product.collectionNumber = this.data.product.collectionNumber - 1;
			} else {
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

	checkIsCollected: function (id) {
		ajax.postJSON('/collection/is_collected.do', {
			relatedTable: 'Production',
			relatedDataId: id
		}, (res) => {
			this.setData({
				isCollected: res.data.data.data
			});
		});
	},

	//登录授权
	bindgetuserinfo: function(e){
		if (e.detail.userInfo != undefined){
			wx.setStorageSync('userInfo', e.detail.userInfo);

			app.getSessionId(() => {
				this.setData({
					loginStatus: true
				});
				this.checkIsCollected(this.data.id);
			});
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let id = options.id || '',
			index = parseInt(options.idx,10);

		this.setData({ 
			loginStatus: app.globalData.loginStatus,
			id :id,
			currentIndex: index || 0,
			swiperIndex: index || 0,
			pageChosen: parseInt(options.pageChosen, 10) || 1
		});

		wx.showLoading({
			title: '加载中...',
		});

		this.getCaseList(this.data.pageChosen);
		
		if (app.globalData.loginStatus) {
			this.checkIsCollected(id);
		}
		
		this.getProductDetail(id);
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