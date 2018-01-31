//获取应用实例
var app = getApp()
Page({
    data: {
        
    },

    //获取我订阅的列表
    clearStorage : function(){
        wx.showModal({
            title: '提示',
            content: '确定清除缓存？',
            success: function(res) {
                if (res.confirm){
                    wx.clearStorage();
                }
            }
        });
    },

    onLoad: function (options) {
        
    }
})
