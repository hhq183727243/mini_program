var app = getApp()

Page({
    data: {
        flag : 0,//1表示选择标签，2表示选择科室
        tagList: [],
        showList : [],
        selectedData : [],
        whichPage : 1
    },

    //初始化字典数据
    initSelectData: function () {
        var that = this,
            flag = this.data.flag;

        //标签字典数据
        wx.request({
            url: app.data.baseUrl + '/app/medicalPictureCase/getSettingDictionaryList',
            method: 'GET',
            data : {
                type: flag
            },
            header: app.data.header,
            success: function (res) {
                if (200 == res.data.status) {
                    var selectedIds = [];

                    that.data.tagList = res.data.data

                    that.data.selectedData.forEach(function (it, index) {
                        selectedIds.push(it.id);
                    });

                    that.data.tagList.forEach(function(it,index){
                        if (selectedIds.indexOf(it.id) > -1){
                            it.checked = true;
                        }else{
                            it.checked = false;
                        }
                    });

                    that.getShowList(1,that.data.tagList);
                }

                wx.hideToast();
            }
        });
    },

    //选择
    checkboxChange: function (e) {
        var that = this,
            selectedArr = e.detail.value;

        this.data.selectedData = [];

        this.data.tagList.forEach(function (it, index) {
            if (selectedArr.indexOf(it.id + '') > -1 || it.checked) {
                it.checked = true;
                that.data.selectedData.push(it);
            }else{
                it.checked = false;
            }
        });

        this.setData({ selectedData: this.data.selectedData });
    },

    //删除标签
    bindDeleteTagTap : function(e){
        var that = this,
            index = e.currentTarget.dataset.index,
            selectedIds = [];

        this.data.selectedData.splice(index,1);

        this.data.selectedData.forEach(function (it, index) {
            selectedIds.push(it.id);
        });

        this.data.tagList.forEach(function (it, index) {
            if (selectedIds.indexOf(it.id) > -1) {
                it.checked = true;
            } else {
                it.checked = false;
            }
        });

        that.setData({ 
            selectedData: that.data.selectedData
        });

        that.getShowList(1, this.data.tagList);
    },

    bindUnselectTap : function(){
        wx.showModal({
            content: (this.data.flag == 2 ? '关联标签' : '临床科室') + '最多只能选择5个',
            showCancel : false
        });
    },

    getShowList: function (whichPage,list){
        var shouCount = whichPage * 20;

        if (shouCount < list.length){
            this.setData({
                showList: list.slice(0,shouCount)
            });
        }else{
            this.setData({
                showList: list
            });
        }
    },

    //检索
    bindSearchInput : function(e){
        var that = this,
            word = e.detail.value.toUpperCase().replace(/，/, ','),
            searchResult = [],
            allData = this.data.tagList,
            dataLen = allData.length,
            key = ['name', 'pinYinAbbreviation','pinyin'],
            keyLen = key.length;

        //如果没有要匹配的值则返回	
        if (word == '' || word == null) {
            that.getShowList(1, allData);
            return;
        }

        //返回匹配到的标签数组	
        for (var i = 0; i < dataLen; i++) {
            for (var j = 0; j < keyLen; j++) {
                if (allData[i][key[j]]) {
                    if (allData[i][key[j]].toUpperCase().indexOf(word) === 0) {
                        searchResult.push(allData[i]);
                        break;
                    }
                }
            }
        }

        that.getShowList(1,searchResult);
    },

    //完成选择
    bindFinishTap : function(){
        if(2 == this.data.flag){
            app.data.selectedTag = this.data.selectedData;
        } else if (1 == this.data.flag){
            app.data.selectedDepartment = this.data.selectedData;
        }

        wx.navigateBack({
            delta : 1
        });
    },

    onLoad: function (options) {
        var that = this,
            flag = parseInt(options.flag,10);

        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration : 10000,
            mask : true
        });

        this.setData({
            flag: flag
        });

        this.setData({
            selectedData: (1 == flag ? app.data.selectedDepartment : app.data.selectedTag) || []
        });

        that.initSelectData();
    }
})