// pages/conditionSelect/conditionSelect.js
var ajax = require('../../utils/server');
var util = require('../../utils/util.js')
var app = getApp();

Page({
	data: {
		currentIndex: -1,
		categoryList: [],
		subCategoryList: [],
		rowList: []
	},

	getDictionary: function(key,type){
		ajax.postJSON('dictionary/list_type.do', {
			type: type,
			pageChosen: -1,
			pageTotal: -1
		}, (res) => {
			var obj = {};
			obj[key] = res.data.list;

			if ('母婴专区' != type){
				obj['rowList'] = util.alignment(res.data.list)
			}

			this.setData(obj);
		});
	},

	showSubcategory: function(e){
		this.setData({
			currentIndex: e.currentTarget.dataset.index
		});
		
		if (this.data.currentIndex == -1){
			this.getSearchHistoryRecord();
		}else{
			this.getDictionary('subCategoryList', e.currentTarget.dataset.name);
		}
	},
	//选择
	bindSelectCondition: function(e){
		var name = e.currentTarget.dataset.name,
			history = wx.getStorageSync('searchKey') || [];
		
		if (history.indexOf(name) < 0){
			history.push(name);
			wx.setStorageSync('searchKey', history);
		}

		wx.navigateTo({
			url: '/pages/production/production?searchKey=' + name,
		});
	},

	getSearchHistoryRecord: function(){
		var history = wx.getStorageSync('searchKey') || [],
			list = [];

		history.forEach((item, index) => {
			list.push({ id: index, name: item });
		});

		this.setData({
			rowList: util.alignment(list)
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getDictionary('categoryList','母婴专区');
		this.getSearchHistoryRecord();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})