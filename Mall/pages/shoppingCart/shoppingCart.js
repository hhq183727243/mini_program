// pages/shoppingCart/shoppingCart.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		total: 999.00,
		selectedAllStatus : false,
		//cartList: []
		cartList: [{ id: 0, buyNumber: 1, price: 5, selected: false}, 
			{ id: 1, buyNumber: 1, price: 6, selected: false}, 
			{ id: 2, buyNumber: 1, price: 7, selected: false},
			{ id: 3, buyNumber: 1, price: 12, selected: false}]
	},

	bindMinus: function (e) {
		var index = parseInt(e.currentTarget.dataset.index);
		var num = this.data.cartList[index].buyNumber;
		// 如果只有1件了，就不允许再减了
		if (num > 1) {
			num--;
		}
		// 只有大于一件的时候，才能normal状态，否则disable状态
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		// 购物车数据
		var cartList = this.data.cartList;
		cartList[index].buyNumber = num;
		// 按钮可用状态
		// 将数值与状态写回
		this.setData({
			cartList: cartList,
		});

		this.sum();
	},
	bindPlus: function (e) {
		var index = parseInt(e.currentTarget.dataset.index),
			num = this.data.cartList[index].buyNumber;
		
		// 购物车数据
		var cartList = this.data.cartList;
		cartList[index].buyNumber = num + 1;

		// 将数值与状态写回
		this.setData({
			cartList: cartList,
		});

		this.sum();
	},

	bindManual: function (e) {
		var index = parseInt(e.currentTarget.dataset.index),
			cartList = this.data.cartList,
			num = parseInt(e.detail.value,10);

		cartList[index].buyNumber = num;

		this.setData({
			cartList: cartList
		});

		this.sum();
	},

	/*绑定点击事件，将checkbox样式改变为选中与非选中*/
	bindCheckbox: function (e) {
		var index = parseInt(e.currentTarget.dataset.index);
		//原始的icon状态
		var selected = this.data.cartList[index].selected;
		var cartList = this.data.cartList;
		// 对勾选状态取反
		cartList[index].selected = !selected;
		// 写回经点击修改后的数组
		this.setData({
			cartList: cartList
		});

		this.sum();
	},

	bindSelectAll: function () {
		// 环境中目前已选状态
		var selectedAllStatus = this.data.selectedAllStatus;
		// 取反操作
		selectedAllStatus = !selectedAllStatus;
		// 购物车数据，关键是处理selected值
		var cartList = this.data.cartList;
		// 遍历
		for (var i = 0; i < cartList.length; i++) {
			cartList[i].selected = selectedAllStatus;
			// update selected status to db
		}
		this.setData({
			selectedAllStatus: selectedAllStatus,
			cartList: cartList,
		});
		this.sum();
		
		//var open_id = app.globalData.openid;
		//this.updateAllSelect(open_id, selectedAllStatus);
	},

	sum: function () {
		var cartList = this.data.cartList,
			len = cartList.length,
			selecedLen = 0;//已选个数

		// 计算总金额
		var total = 0;
		for (var i = 0; i < len; i++) {
			if (cartList[i].selected) {
				selecedLen++;
				total += cartList[i].buyNumber * cartList[i].price;
			}
		}
		var newValue = parseInt(total * 100);
		total = newValue / 100.0;
		
		// 写回经点击修改后的数组
		this.setData({
			total: total,
			selectedAllStatus: selecedLen == len
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})