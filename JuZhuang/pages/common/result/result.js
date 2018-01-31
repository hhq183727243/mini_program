var app = getApp();
Page({
    data : {
        data : '',
        flag : 0,
        title : '',
        introd : '',
        mainBtnText : '',
        secondaryBtnText : ''
    },
    initData : function(n){
		var title = '',
            infoTip = '',
            btnText1 = '',
            btnText2 = '';
			
        //根据n来标记结果页要展示的内容
        switch(n){
            //找回密码成功过提示
            case 1 :
                title = '修改成功';
                btnText1 = '继续登录';
                btnText2 = '返回首页';
                break;
            //注册成功提示页    
            case 2 :
                title = '注册成功';
                btnText1 = '前往登录';
                btnText2 = '返回首页';
                break;    
			//账号绑定成功提示
            case 3 :
                title = '绑定成功';               
                btnText1 = '关闭';
                 break;
            //添加病例成功提示
            case 4:
                title = '添加成功';
                btnText1 = '查看详细';
                btnText2 = '返回列表';
                break;
            //添加评论成功提示
            case 5:
                title = '评论成功';
                btnText1 = '关闭';
                break;
            default : 
                title = '操作成功';
                btnText1 = '返回首页';
                btnText2 = '返回上一级';
                break;
        }

        this.setData({
            flag : n,
            title : title,
            introd : infoTip,
            mainBtnText : btnText1,
            secondaryBtnText : btnText2
        });
    },
    
    //主要按钮点击处理事件
    mainHandleTap : function(){
        switch(this.data['flag']){
            case 1 :
                //回到登录页
                wx.navigateBack({
                    delta: 3
                });
                break;
            case 2 :
                //回到登录页
                wx.navigateBack({
                    delta: 2
                });
                break; 
			case 3 :
            case 5 :
               //返回上一级
                wx.navigateBack({
                    delta: 1
                });
                break;
            case 4:
                //添加病例成功查看病例详细
                wx.redirectTo({
                    url: '../../medicalPictureCaseDetail/medicalPictureCaseDetail?id=' + this.data.data,
                });
                break;    
        }
    },

    //次要按钮点击处理事件
    secondaryHandleTap : function(){
        switch(this.data['flag']){
            case 1 :
            case 2 :
                //返回首页
                wx.switchTab({
                    url: '../../index/index'
                });
                break;
            case 4:
                //添加病例成功返回列表
                wx.navigateBack({
                    delta: 1
                });
                break; 
        }
    },

    onLoad : function(options){
        this.initData(parseInt(options.flag,10));

        this.setData({
            data: options.data || ''
        });
    }
})