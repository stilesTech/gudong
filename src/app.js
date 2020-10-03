//app.js 
var https = require('utils/https.js')
App({
  globalData: {
    domain: "https://api.stiles.cc",
    detailUrl:"https://api.stiles.cc/novels/get",
    novelsUrl: "https://api.stiles.cc/novels",
    recommendUrl: "https://api.stiles.cc/novels/recommend",
    chaptersUrl: "https://api.stiles.cc/novels/getChapters",
    chaptersContentUrl: "https://api.stiles.cc/novels/getChaptersContent",
    categoryUrl: "https://api.stiles.cc/novels/getCategory",
    searchUrl: "https://api.stiles.cc/novels/search",
    feedbackUrl: "https://api.stiles.cc/feedback/send",
    novelSerialNumbersUrl: "https://api.stiles.cc/novels/getNovelSerialNumbers",
    searchKeywords: "https://api.stiles.cc/novels/getSearchKeywords",
    token:null,
    userInfo: null
  },
   onLaunch: function () {
     this.trySetUserInfo();
     this.removeCache();
  },
  trySetUserInfo: function () {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },
  removeCache:function(){
    var value = wx.getStorageSync('cateListTime')
    var nowTime = new Date().getTime();
    if(value){
      if (value < nowTime) {
        wx.removeStorage("cateList");
      }
    }
    value = wx.getStorageSync('searchKeysTime')
    if (value) {
      if (value < nowTime) {
        wx.removeStorage("searchKeysTime");
      }
    }
  }
})