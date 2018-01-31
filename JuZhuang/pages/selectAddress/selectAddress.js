var ajax = require('../../utils/server.js');

module.exports = {
	data : {
		region: ['省', '市', '区/县'],
		addressShow: false,
		addressSelected: [0, 0, 0],
		proviceData: [],
		cityData: [],
		districtData: [],
	},
	initAddress: function (selectAddress) {
		for (let key in selectAddress) {
			if (key == 'data') {
				let obj = {};

				for (let k in selectAddress.data) {
					obj[k] = selectAddress.data[k];
				}

				this.setData(obj);
			}else{
				if (key != 'initAddress'){
					this[key] = selectAddress[key]
				}
			}
		}

		this.getProviceData(1);
	},
	//显示选择面板
	showAddressSelect: function () {
		this.setData({
			addressShow: true
		});
	},

	//取消
	cancelAddress: function () {
		this.setData({
			addressShow: false
		});
	},

	//确定
	selectAddress: function () {
		var addressSelected = this.data.addressSelected,
			p = this.data.proviceData,
			c = this.data.cityData,
			d = this.data.districtData;

		this.setData({
			addressShow: false,
			region: [p[addressSelected[0]].name, c[addressSelected[1]].name, d[addressSelected[2]].name]
		});

		if (typeof this.selectAddreddCallback == 'function'){
			this.selectAddreddCallback();
		}
	},
	/**
	 * 滑动事件
	 */
	bindAddressChange: function (e) {
		var val = e.detail.value;

		if (this.data.addressSelected[0] != val[0]) {
			this.setData({
				addressSelected: [val[0], 0, 0]
			});

			this.getCityData(this.data.proviceData[val[0]]['id']);

		} else if (this.data.addressSelected[1] != val[1]) {
			this.setData({
				addressSelected: [this.data.addressSelected[0], val[1], 0]
			});

			this.getDistrictData(this.data.cityData[val[1]]['id']);
		} else {
			this.setData({
				addressSelected: val
			});
		}
	},

	getProviceData: function (parentCode) {
		ajax.postJSON('/dictionary/list_location_superior.do', { id: parentCode }, (res) => {
			let proviceData = res.data.data.list;

			this.getCityData(proviceData[0]['id']);

			this.setData({
				proviceData: proviceData
			});
		});
	},

	getCityData: function (parentCode) {
		ajax.postJSON('/dictionary/list_location_superior.do', { id: parentCode }, (res) => {
			let cityData = res.data.data.list;

			this.getDistrictData(cityData[0]['id']);

			this.setData({
				cityData: cityData
			});
		});
	},

	getDistrictData: function (parentCode) {
		ajax.postJSON('/dictionary/list_location_superior.do', { id: parentCode }, (res) => {
			this.setData({
				districtData: res.data.data.list
			});
		});
	}
}