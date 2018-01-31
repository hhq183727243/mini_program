var ajax = require('../../utils/server.js');
var selectAddress = require('../selectAddress/selectAddress.js');

var app = getApp();

Page({
	data: {
		baseUrl: app.globalData.baseUrl,
		index0: 0,
		index1: 0,
		conditions: [
			[{ name: '擅长风格'}],
			['公司规模', '小型', '中小型', '中大型', '大型', '全国连锁']],
		sellerList: [],
		pageChosen: 1,
		hasMoreData: true
	},

	goFreeDesignPage: function(){
		wx.navigateTo({
			url: '/pages/freeDesign/freeDesign',
		});
	},

	bindSelectChange: function (e) {
		let flag = e.currentTarget.dataset.flag,
			index = e.detail.value;
		
		var obj = {};
		obj['index' + flag] = parseInt(index, 10);

		this.setData(obj);
		this.getSellerList(1);
	},

	selectAddreddCallback: function(){
		this.getSellerList(1);
	},

	getSellerList: function (pageChosen){
		var speciality = this.data.conditions[0][this.data.index0].name,
			companySize = this.data.conditions[1][this.data.index1];

		ajax.postJSON('/seller/list_cooperation.do',{
			associationId: app.globalData.sellerId,
			province: this.data.region[0] == '省' ? '' : this.data.region[0],
			city: this.data.region[0] == '省' ? '' : this.data.region[1],
			district: this.data.region[0] == '省' ? '' : this.data.region[2],
			speciality: this.data.index0 == 0 ? '' : speciality,
			companySize: this.data.index1 == 0 ? '' : companySize,
			pageChosen: pageChosen,
			pageTotal: 20,
			sortField: 'displayIndex',
			sortType: 'ASC',
			secondSortField: 'datetime',
			secondSortType: 'DESC',
		},(res) => {
			wx.stopPullDownRefresh();

			let list = res.data.data.list;

			if (1 == pageChosen) {
				this.setData({
					pageChosen: pageChosen,
					hasMoreData: list.length >= 20,
					sellerList: list
				});
			} else {
				this.setData({
					pageChosen: pageChosen,
					hasMoreData: list.length >= 20,
					sellerList: this.data.sellerList.concat(list)
				});
			}
		});
	},

	formSubmit: function (e) {
		var submitData = e.detail.value;

		if (submitData.contact == '') {
			wx.showModal({
				content: '请输入您的昵称',
				showCancel: false
			});
			return;
		}

		var partten = /^1[3,4,5,8,9]\d{9}$/;

		if (submitData.mobilephone == '' || !partten.test(submitData.mobilephone)) {
			wx.showModal({
				content: '请输入正确手机号',
				showCancel: false
			});
			return;
		}

		if (this.data.region[0] == '省') {
			wx.showModal({
				content: '请选择地区',
				showCancel: false
			});
			return;
		}

		submitData.userId = app.globalData.sellerId;
		submitData.country = '中国';
		submitData.type = 0;
		submitData.province = this.data.region[0];
		submitData.city = this.data.region[1];
		submitData.district = this.data.region[2];
		submitData.sourceType = 3;

		ajax.postJSON('/address/add.do', submitData, (res) => {
			wx.showModal({
				title: '提交成功',
				content: '我们将会在稍后给你致电请耐心等待',
				showCancel: false,
				confirmText: '我知道了'
			});
		});
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

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		selectAddress.initAddress.apply(this, [selectAddress]);
		
		this.getDictionary('风格', 0);

		if (app.globalData.sellerId == ''){
			ajax.postJSON('/seller/detail_default.do', (res) => {
				app.globalData.seller = res.data.data.data;
				app.globalData.sellerId = res.data.data.data.id;

				this.getSellerList(1);
			});
		}else{
			this.getSellerList(1);
		}
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.getSellerList(1);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		this.getSellerList(this.data.pageChosen + 1);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '居装网',
			desc: '厦门居装网络科技有限公司免费专业顾问服务',
			path: '/pages/seller/seller'
		}
	}
})