var auth = require('../../utils/auth.js')

// pages/user/user.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
      userInfo:null
  },
  goAbout:function(){
    wx.navigateTo({
      url: `../about/about`
    });
  },
  goFeedback: function () {
    wx.navigateTo({
      url: `../feedback/feedback`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = app.globalData.userInfo;
    if(!userInfo){
      auth.getUserInfo().then(function () {
        userInfo = app.globalData.userInfo;
      }, function (e) {
         console.log(e);
      });
    }else{
      that.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})