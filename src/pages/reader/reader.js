var app = getApp()
var https = require('../../utils/https.js')
var util = require('../../utils/util.js')
var moveTime = null; //控制左滑右滑的动画
var isMoving = 0;
var leftTimmerCount = 0;
var rightTimmerCount = 0;
var hasRunTouchMove = false;
/**

* 计算总页数函数，需要理解行高---line-height和字体大小font-size之间的关系，可以查考http://www.jianshu.com/p/f1019737e155，以及http://www.w3school.com.cn/cssref/pr_dim_line-height.asp
* @param str 需要分页的内容
* @param fontSize 当前的字体大小
* @param lineHeight 当前的行高
* @param windowW 当前window的宽度
* @param windowH 当前window的高度
* @param pixelRatio 当前分辨率，用来将rpx转换成px
*/

function countPageNum(str, fontSize, lineHeight, windowW, windowH, pixelRatio) {
  var returnNum = 0;
  fontSize = fontSize;
  lineHeight = lineHeight;
  //将str根据’\n‘截成数组
  var strArray = str.split(/\n+/);
  var splitArray = [];//换行符的个数集合
  var reg = new RegExp('\n+', 'igm');
  var result = '';
  //这里写一个for循环去记录每处分隔符的\n的个数，这将会影响到计算换行的高度
  while ((result = reg.exec(str)) != null) {
    splitArray.push(result.toString().match(/\n/img).length);
  }
  var totalHeight = 0;
  strArray.forEach(function (item, index) {
    var wrapNum = 0;
    //splitArray的长度比strArray小1
    if (splitArray.length < index) {
      wrapNum = splitArray[index] - 1;
    }
    //Math.ceil向上取整
    totalHeight += Math.ceil(item.length / Math.floor((windowW - 120 / pixelRatio) / fontSize)) * lineHeight + wrapNum * lineHeight;
   
  });
  return Math.ceil(totalHeight / windowH)+1;
}
function gotoReader(id, serialNumber){
  wx.redirectTo({
    url: `../reader/reader?id=${id}&serialNumber=${serialNumber}`
  });
}
Page({
  data: {
    id: '',
    serialNumber: 1,
    title: '',
    Name :'',
    content: '',
    showCatelog: false,
    catelogs: {},
    fontSize: 16, //单位rpx
    lineHeight: 26, //单位rpx
    windows: { windowsHeight: 0, windowsWidth: 0, pixelRatio: 1 },
    touches: { lastX: 0, lastY: 0 },
    moveDirection: 0, //0代表左滑动，1代表右滑动
    leftValue: 0,
    pageIndex: 1,
    pageNum: 0,
  },
  onReady: function () {
    var that = this;
    //获取屏幕的高度和宽度，为分栏做准备
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ windows: { windowsHeight: res.windowHeight-20, windowsWidth: res.windowWidth, pixelRatio: res.pixelRatio } });
      }
    });
  },
  toReader: function (e) {
    var that = this;
    let serialNumber = 1;
    if (e.currentTarget.dataset.serialnumber) {
      serialNumber = e.currentTarget.dataset.serialnumber;
    }
    gotoReader(that.data.id, serialNumber);
  },
  changeShowCatelog: function (e) {
    var that = this;
    that.setData({
      showCatelog: !that.data.showCatelog
    })
    if (that.data.showCatelog) {
      that.initCatelog(that.data.id);
    }
  },
  initChapters: function (id, serialNumber,loadPageIndex) {
    var that = this;
    let url = app.globalData.chaptersContentUrl + `?nid=${id}&serialNumber=${serialNumber}`;
    wx.showLoading({
      title: '加载中',
      mark:true
    });
    var pageindex=1;
    if (loadPageIndex){
      pageindex= that.data.pageIndex;
    }
    https.get(url, function (res) {
      try {
        var content = res.Data.Content.trim();
        var name = (res.Data.Name||'').trim();
        content = content.replace("\n\n", "\n");
        var pageNum = countPageNum(content, that.data.fontSize, that.data.lineHeight, that.data.windows.windowsWidth, that.data.windows.windowsHeight, that.data.windows.pixelRatio);
        var windth = that.data.windows.windowsWidth;
        var leftValue = windth * (pageindex - 1)
        //重新排版
        that.setData({
          content: content, name: name, serialNumber: parseInt(serialNumber), pageNum: pageNum, pageIndex: pageindex,
          leftValue: -leftValue , moveDirection: 0, touches: { lastX: 0, lastY: 0 }});
        wx.hideLoading();
      } catch (e) {
        console.log(e);
        wx.hideLoading();
      }
      wx.hideLoading();
    }, function (e) {
      wx.hideLoading();
      console.error(e)
    });
  },
  refreshCatelog: function () {
    var that = this;
    that.initCatelog(that.data.id);
  },
  sortCatelog: function () {
    var that = this;
    var catelogs = that.data.catelogs;
    that.setData({
      catelogs: catelogs.reverse()
    });
  },
  initCatelog: function (id) {
    var that = this;
    let url = app.globalData.chaptersUrl + `?nid=${id}`
    wx.showLoading({
      title: '加载中',
      mark: true
    });
    https.get(url, function (res) {
      that.setData({
        catelogs: res.Data,
      });
      //二次设定serialNumber用于设置scorll-view滚动条位置
      that.setData({
        serialNumber: that.data.serialNumber
      });
      wx.hideLoading();
    }, function () { wx.hideLoading(); });
  },
  onLoad: function (options) {
    var that = this;
    var serialNumber=1;
    var pageIndex=1;
    if (!options.serialNumber){
      var serail = that.getReadProgress(options.id);
      serialNumber = serail.split("_")[0]||1;
      pageIndex = serail.split("_")[1]||1;
    }else{
      serialNumber=parseInt(options.serialNumber)
    }
    showCatelog: (options.showCatelog == "true" ? true : false)
    //动态设置标题
    that.setData({ id: options.id, serialNumber: serialNumber, title: options.title, pageIndex:pageIndex });
    that.initChapters(options.id, serialNumber,true);
  },

  onUnload: function () {
    // 页面关闭，存储页面进度
    this.setReadProgress();
    console.log("reading onUnload");
  },
  //重新显示页面执行函数
  onShow: function () {
    var that = this;
    //读取用户设置
    wx.getStorage({
      key: 'readerSetting',
      success: function (res) {
        var userSetting = JSON.parse(res.data);
        that.setData({
          fontSize: userSetting.fontSize || that.data.fontSize,
          pageIndex: userSetting.pageIndex || that.data.pageIndex,
        });
      }
    });
  },
  //跳出页面执行函数
  onHide: function () {
    var that = this;
    //onUnload方法在页面被关闭时触发，我们需要将用户的当前设置存下来
    try {
      var userSetting = {
        fontSize: that.data.fontSize, // 控制当前章节，亮度，字体大小
        pageIndex: that.data.pageIndex, // 当前第几页
      };
      wx.setStorage('readerSetting', JSON.stringify(userSetting));
    } catch (e) {
      console.log(e);
    }
  },
  handleTouchMove: function (e) {
    var that = this;
    if (isMoving == 1) {
      return;
    }
    var currentX = e.touches[0].pageX;
    var currentY = e.touches[0].pageY;
    // 判断没有滑动而是点击屏幕的动作
    hasRunTouchMove = true;
    console.log('正在执行touchmove, isMoving为：' + isMoving + '------e: {x: ' + e.touches[0].pageX + ' ,y: ' + e.touches[0].pageY + '}');
    var direction = 0;
    if ((currentX - that.data.touches.lastX) < 0) {
      direction = 0;
    }
    else if (((currentX - that.data.touches.lastX) > 0)) {
      direction = 1;
    }
    //需要减少或者增加的值
    //将当前坐标进行保存以进行下一次计算
    that.setData({ touches: { lastX: currentX, lastY: currentY }, moveDirection: direction });
  },
  handleTouchStart: function (e) {
    var that=this;
    // 判断用户的点击事件，如果不是滑动，将不会执行touchmove
    hasRunTouchMove = false;
    var width = that.data.windows.windowsWidth;
    var direction=0;
    if (e.touches[0].pageX < (that.data.windows.windowsWidth/2)){
      direction = 1;
    }
    if (isMoving == 0) {
      that.setData({ touches: { lastX: e.touches[0].pageX, lastY: e.touches[0].pageY }, moveDirection: direction });
    }
  },
  getReadProgress(id){
    var key = "ReadProgress_" + id;
    var rtn = wx.getStorageSync(key);
    if (rtn =="_undefined"){
      rtn ="1_1";
    }
    return rtn;
  },
  setReadProgress(e){
    var that=this;
    var key = "ReadProgress_" + that.data.id;
    var data = that.data.serialNumber + "_" + that.data.pageIndex;
     wx.setStorage({
        key:key,
        data:data
     });
  },
  handleTouchEnd: function () {
    console.log('正在执行touchend, isMoving为：' + isMoving);
    var that = this;
    // 判断用户的点击事件，决定是否显示控制栏
    if (hasRunTouchMove == false) {
      var y = that.data.touches.lastY;
      var x = that.data.touches.lastX;
      var h = that.data.windows.windowsHeight / 2;
      var w = that.data.windows.windowsWidth / 2;
      if (x && y && y >= (h - 50) && y <= (h + 50) && x >= (w - 60) && x <= (w + 60)) {
        that.changeShowCatelog();
        return;
      }
    }
    //左滑动和有滑动的操作
    var currentIndex = that.data.pageIndex; //当前页数
    if (isMoving == 0) {
      if (that.data.moveDirection == 0) {
        if (currentIndex < that.data.pageNum) {
          isMoving = 1;
          var windth = that.data.windows.windowsWidth;
          ++currentIndex;
          var leftValue = windth * (currentIndex-1)
          that.setData({ pageIndex: currentIndex, leftValue:-leftValue });
        }else{
          var serialNumber = that.data.serialNumber;
          serialNumber = serialNumber + 1;
          that.initChapters(that.data.id, serialNumber);
          console.log("下一页");
        }
      } else {
        //前一页和后一页相差其实是2个-320px
        if (currentIndex > 1) {
          isMoving = 1;
          var windth = that.data.windows.windowsWidth;
          --currentIndex;
          var leftValue = windth * (currentIndex - 1)
          that.setData({ pageIndex: currentIndex, leftValue: -leftValue });
        }
        else{
          var serialNumber = that.data.serialNumber;
          if (serialNumber<=1){
            wx.showToast({
              title: '亲,已经是第一章了:）',
              icon: 'success',
              duration: 2000
            })
          }else{
            serialNumber = serialNumber-1;
            that.initChapters(that.data.id, serialNumber);
          }
          console.log("上一页");
        }
      }
      isMoving=0;
    } else {

    }
  }
});