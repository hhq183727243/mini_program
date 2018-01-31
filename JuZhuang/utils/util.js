function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//平均分配标签宽度
function alignment(tagList){

  var rowList = [],
      windowWidth = 0,
      _width = 0,//当前排标签总宽度
      _row = [];

     //获取系统尺寸
    wx.getSystemInfo({
        success: function(res) {
            windowWidth = res.windowWidth - 20 + 5
        }
    });

  tagList.forEach(function(item,index){
      var len = item.name.length; //获取每个标签字数一个字算14px
      var borderColor = 'b_color_' + (index%6 + 1);//给每个标签分配一个颜色值
      
      //填充一列，27 = 两边内间距10 * 2 + 边框2 + margin-right5
      if((_width + 27 + len * 14) > windowWidth){
          //分配剩余宽度
          var remainWidth = windowWidth - _width,
              //分配值 = （总宽度 - 标签宽度）/标签个数
              addWidth = Math.floor((remainWidth)/_row.length),
              remainder = remainWidth%_row.length,
              _newWidth = 0;//分配后的新值

          //为每个标签加上分配值
          for(var i = 0;i < _row.length;i++){
              //把剩余余数给前面标签平均分配1px
                _newWidth = _row[i]['width'] + addWidth + (i < remainder ? 1 : 0);

              _row[i]['width'] = (_newWidth > windowWidth ? windowWidth :_newWidth);
          }

          rowList.push(_row);

          //宽度超出后重新添加一列
          _width = 0;
          _row = [];
      }

      _width += (27 + len * 14);
      item.width = (27 + len * 14);
      item.borderColor = borderColor;
      _row.push(item);

      if(index === tagList.length - 1){
            rowList.push(_row);
      }
  });

  return rowList;
}


module.exports = {
  formatTime: formatTime,
  alignment : alignment
}
