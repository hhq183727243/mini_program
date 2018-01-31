//获取应用实例
var app = getApp()
Page({
    data: {
        items : [{
            nameEn : 'HotNews',
            name : '热点医讯',
            checked : false,
        },{
            nameEn : 'MonthlySpecialReport',
            name : '临床突破',
            checked : false,
        },{
            nameEn : 'RenownedDoctorBlog',
            name : '医学博文',
            checked : false,
        },{
            nameEn : 'RenownedDoctorInterview',
            name : '名医访谈',
            checked : false,
        },{
            nameEn : 'ControversyAndViewpoint',
            name : '诊疗争议',
            checked : false,
        },{
            nameEn : 'MonthlySpecialReport',
            name : '每月专题',
            checked : false,
        },{
            nameEn : 'EvidenceBasedMedicine',
            name : '循证医学',
            checked : false,
        },{
            nameEn : 'TranslationalMedicine',
            name : '转化医学',
            checked : false,
        },{
            nameEn : 'TechniqueInnovation',
            name : '新型诊疗',
            checked : false,
        }]
    },

    //获取我订阅的列表
    getMysubscriptionList : function(){
        var that = this;

        wx.request({
			url: app.data.baseUrl + '/app/subscription/list',
            header: app.data.header,
			success: function(res) {
				if(200 === res.data['status']){
					var mysubscriptionList = res.data['data'];

                    for(key in mysubscriptionList){
                        for(var i = 0;i < that.data['items'];i++){
                            if(key === that.data['items']['nameEn']){
                                that.data['items']['checked'] = mysubscriptionList[key];
                            }
                        }
                    }

                    that.setData({
                        items: that.data['items']
                    });
				}
			}
		})
    },

    onLoad: function (options) {
        var that = this;
        this.getMysubscriptionList();
    }
})
