// pages/pic/pic.js
var ajax = require('../../utils/server.js');
var app = getApp();

Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		tabFlag: 0,//0定制，1套图
		labels0: ['综合排序', '空间', '风格'],//定制分类
		queryCondition0: ['', '', '', '', ''],//检索条件

		initLabels: ['综合排序', '空间', '风格', '户型', '面积'],
		labels: ['综合排序','空间','风格','户型','面积'],
		conditionIndex: 0,
		conditions: [
			[{ name: '综合排序' }, { name: '按收藏数' }, { name: '按浏览数'}],
			[{ name: '不限' }],
			[{ name: '不限' }],
			[{ name: '不限' }],
			[{ name: '不限' }]
		],
		show :false,
		queryCondition: ['','','','',''],//检索条件
		list: [],
		pageChosen: 1,
		hasMoreData: true
	},
	changeType: function(e){
		var index = e.currentTarget.dataset.idx;

		this.setData({
			tabFlag: index,
			show: false
		});

		wx.showLoading({
			title: '加载中...',
		});
		
		this.getProductList(1);
	},
	toggleMenu: function(e){
		var index = e.currentTarget.dataset.index,
			show = !this.data.show;

		if (this.data.conditionIndex != index){
			show = true;
		}

		this.setData({
			conditionIndex: index,
			show: show
		});
	},

	//选择条件
	bindSelectCondition: function(e){
		var parentIdx = e.currentTarget.dataset.idx,
			childrenIdx = e.currentTarget.dataset.index,
			labels = this.data.tabFlag == 1 ? this.data.labels : this.data.labels0,
			queryCondition = this.data.tabFlag == 1 ? this.data.queryCondition : this.data.queryCondition0;
		
		if (this.data.conditions[parentIdx][childrenIdx].name != '不限'){
			labels[parentIdx] = this.data.conditions[parentIdx][childrenIdx].name;
			queryCondition[parentIdx] = this.data.conditions[parentIdx][childrenIdx].name;
		}else{
			labels[parentIdx] = this.data.initLabels[parentIdx];
			queryCondition[parentIdx] = '';
		}

		this.setData({
			labels0: this.data.labels0,
			labels: this.data.labels,
			queryCondition: this.data.queryCondition,
			queryCondition0: this.data.queryCondition0,
			show: false
		});

		wx.showLoading({
			title: '加载中...',
		});

		this.getProductList(1);
	},

	//字典数据获取
	getDictionary: function (type, key) {
		ajax.postJSON('/dictionary/list_type.do', {
			type: type,
			sortField: 'pinYinAbbreviation',
			sortType: 'ASC',
			pageChosen: -1,
			pageTotal: -1
		}, (res) => {
			this.data.conditions[key] = this.data.conditions[key].concat(res.data.data.list);

			this.setData({
				conditions: this.data.conditions
			});
		});
	},

	//获取图库列表
	getProductList: function (pageChosen){
		let queryCondition = this.data.tabFlag == 1 ? this.data.queryCondition : this.data.queryCondition0;

		let sortField = queryCondition[0];
		
		if(sortField == '按收藏数'){
			sortField = 'collectionNumber';
		} else if (sortField == '按浏览数') {
			sortField = 'readNumber';
		}else{
			sortField = 'displayIndex';
		}

		if (this.data.tabFlag == 1){
			this.data.queryCondition[0] = sortField;
		}else{
			this.data.queryCondition0[0] = sortField;
		}
		

		ajax.postJSON('/production/list.do',{
			sellerId: app.globalData.sellerId,
			column1: 'production',

			secondType: queryCondition[1],//空间
			thirdType: queryCondition[2],//风格
			childModule: queryCondition[3],//户型
			location: queryCondition[4],//面积
			column3: this.data.tabFlag == 0 ? 'case' : 'production',
			
			sortField: sortField,
			sortType: sortField == 'displayIndex' ? 'ASC' : 'DESC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
			pageChosen: pageChosen,
			pageTotal: 20
		},(res) => {
			wx.hideLoading();
			wx.stopPullDownRefresh();
			
			if(res.data.status == 200){
				let list = res.data.data.list;

				if (pageChosen == 1){
					this.setData({
						pageChosen: pageChosen,
						list: list,
						hasMoreData: res.data.data.pageCount > pageChosen
					});
				}else{
					this.setData({
						pageChosen: pageChosen,
						list: this.data.list.concat(list),
						hasMoreData: res.data.data.pageCount > pageChosen
					});
				}
			}
		});
	},

	//图片加载完成
	bindImageLoad: function(e){
		//console.log(e.detail)
	},

	//页面跳转处理
	bindForDetail: function(e){
		var id = e.currentTarget.dataset.id,
			idx = e.currentTarget.dataset.idx;
		
		if(this.data.tabFlag == 0){
			app.globalData.queryCondition = this.data.queryCondition0;

			wx.navigateTo({
				url: '/pages/production/production?id=' + id + '&idx=' + idx + '&pageChosen=' + this.data.pageChosen
			})
		}else{
			wx.navigateTo({
				url: '/pages/pic/detail/detail?id=' + id
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//加载字典数据
		this.getDictionary('空间',1);
		this.getDictionary('风格', 2);
		this.getDictionary('户型', 3);
		this.getDictionary('面积', 4);

		if (app.globalData.sellerId == '') {
			ajax.postJSON('/seller/detail_default.do', (res) => {
				app.globalData.seller = res.data.data.data;
				app.globalData.sellerId = res.data.data.data.id;
				this.getProductList(1);
			});
		} else {
			wx.showLoading({
				title: '加载中...',
			});
			this.getProductList(1);
		}
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.getProductList(1);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if (this.data.hasMoreData){
			this.getProductList(this.data.pageChosen + 1);
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '居装网',
			desc: '厦门居装网络科技有限公司免费专业顾问服务',
			path: '/pages/pic/pic'
		}
	}
})