var app = getApp()
var https = require('../../utils/https.js')

Page({
  data: {
    // text:"这是一个页面"
    list: [],
    windowHeight: 0,//获取屏幕高度
    refreshing:false,
    size: 20
  },
  initWindowHeight:function(){
    //获取屏幕高度  
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  init:function(){
    var that = this;
    wx.getStorageInfo({
      success: function (res) {
        let data = new Array();
        res.keys.forEach(function (item, index) {
          if (item.startsWith("book")) {
            var value = wx.getStorageSync(item);
            if (value) {
              data.unshift(value);
            }
          }
        });
        that.setData({
          list: data,
          hidden: true,
        });
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    that.initWindowHeight();
    //wx.clearStorage()
    //that.init();
  },

  onReady: function () {
    // 页面渲染完成
   
  },
  onShow: function () {
    // 页面显示
    this.init();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  refesh:function(e){
    var that=this;
     //NewsChaptersUrl
    if (that.data.list && that.data.list.length>0){
      if (that.data.refreshing) {
        return;
      }
      that.setData({
        refreshing: true
      });
      var nids="";
      for (var i in that.data.list) {
          var item= that.data.list[i];
          nids+=item.Id+"_";
      }
      nids=nids.substr(0, nids.length - 1);
      var url = app.globalData.novelSerialNumbersUrl + `?nids=${nids}`;
      https.get(url,
        function (res) {
          var list = that.data.list;
          for(var i in res.Data){
            for (var z in list){
              if (list[z].Id == res.Data[i].Id && list[z].LatestSerialNumber != res.Data[i].LatestSerialNumber)
              {
                list[z].LatestSerialNumber = res.Data[i].LatestSerialNumber;
                list[z].LatestChapterName = res.Data[i].LatestChapterName;
                wx.setStorage({
                  key: "book" + list[z].Id,
                  data: list[z],
                });
                break;
              }
            }
          }
          setTimeout(function(){
            that.setData({
              list: list,
              refreshing: false
            });
          }, 1000)
        }, function (res) {
          setTimeout(function () {
            that.setData({
              list: list,
              refreshing: false
            });
          }, 1000)
        });
    }
    
  },
  //点击事件处理
  clickDetail: function (e) {
    wx.navigateTo({
      url: `../reader/reader?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`
    });
  },
  clickAddBook:function(){
    wx.switchTab({
      url: `../index/index`
    });
  },
  removeBookshelf:function(e)
  {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定移除书架吗？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync("book" + e.currentTarget.dataset.id);
          that.init();
        } 
      }
    })
  }
})