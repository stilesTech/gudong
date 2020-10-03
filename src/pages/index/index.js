var app = getApp()
var https = require('../../utils/https.js')
var auth = require('../../utils/auth.js')

Page({
  data: {
    // text:"这是一个页面"
    list: [],
    windowHeight: 0,//获取屏幕高度  
  },
  onLoad: function (options) {
    var that = this;
    //获取屏幕高度  
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    auth.trySettingToken().then(function () {
      that.getData();
    });
  },
  getData(){
    var that = this;
      try {
        var value = wx.getStorageSync('cateList')
        if (value) {
          that.setData({
            list: value,
          });
        } else {
          var url = app.globalData.categoryUrl;
          https.get(url,
            function (res) {
              that.setData({
                list: res.Data,
              });
              wx.setStorage({
                key: "cateList",
                data: res.Data
              })
              wx.setStorage({
                key: "cateListTime",
                data: new Date((new Date() / 1000 + 86400) * 1000).getTime()
              })
            }, function (res) {
              console.log(res);
            });
        }
      } catch (e) {
      }
  },
  toList:function(e){
    wx.navigateTo({
      url: `../list/list?keyword=${e.currentTarget.dataset.cat}`
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //点击事件处理
  bindViewTap: function (e) {
    console.log(e.currentTarget.dataset.id);
  },
})