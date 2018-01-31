//获取应用实例
var app = getApp()
Page({
    data: {
        isAll : true,
        selectedTag: [],//已选择标签
        selectedDepartment: [],//已选择科室
    },

    //获取我订阅的列表
    radioChange : function(e){
        var val = e.detail.value;

        this.setData({
            isAll: !this.data.isAll
        });
    },

    getSettingDictionaryList : function(_type,selectedArr){
        var that = this;

        //标签字典数据
        wx.request({
            url: app.data.baseUrl + '/app/medicalPictureCase/getSettingDictionaryList',
            method: 'GET',
            data: {type: _type },
            header: app.data.header,
            success: function (res) {
                if (200 == res.data.status) {
                    var list = res.data.data,
                        selectedIds = [],
                        tempArr = [];

                    selectedArr.forEach(function (it,index) {
                        selectedIds.push(it.id);
                    });

                    list.forEach(function (it, index) {
                        if (selectedIds.indexOf(it.id) > -1) {
                            tempArr.push(it);
                        }
                    });

                    if (1 == _type){
                        that.setData({
                            selectedDepartment: tempArr
                        });
                        app.data.selectedDepartment = tempArr;
                    }else{
                        that.setData({
                            selectedTag: tempArr
                        });
                        app.data.selectedTag = tempArr;
                    }
                }
            }
        });
    },

    //获取用户设置
    getUserSetting : function(){
        var that = this;

        wx.request({
            url: app.data.baseUrl + '/app/medicalPictureCase/getUserSetting',
            method: 'GET',
            header: app.data.header,
            success: function (res) {
                if (200 == res.data.status) {
                    if (0 != res.data.data.department.length || 0 != res.data.data.tag.length){	
                        
                        that.getSettingDictionaryList(1, res.data.data.department);

                        that.getSettingDictionaryList(2, res.data.data.tag);

                        that.setData({
                            isAll: false
                        });		
                    }else{
                        that.setData({
                            isAll: true
                        });	
                    }
                }
            }
        });
    },

    //保存设置
    bindSubmit : function(){
        var that = this,
            data = {},
            departmentIdArr = [],
            tagIdArr = [];

        if (!this.data.isAll){
            this.data.selectedDepartment.forEach(function (it, index) {
                departmentIdArr.push(it.id);
            });

            this.data.selectedTag.forEach(function (it, index) {
                tagIdArr.push(it.id);
            });

            data.departments = departmentIdArr.join(',');
            data.tags = tagIdArr.join(',');
        }

        wx.request({
            url: app.data.baseUrl + '/app/medicalPictureCase/updateUserSetting',
            method: 'POST',
            data: data,
            header: app.data.header3,
            success: function (res) {
                if (200 == res.data.status) {
                    wx.showModal({
                        content: '设置成功',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }
                    })
                }
            }
        });
    },

    onLoad: function (options) {

        this.getUserSetting();
    },
    onShow: function () {
        this.setData({
            selectedTag: app.data.selectedTag || [],
            selectedDepartment: app.data.selectedDepartment || []
        });
    },
    onUnload : function(){
        app.data.selectedDepartment = [];
        app.data.selectedTag = [];
    }
})
