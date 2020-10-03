var app = getApp()
var https = require('../../utils/https.js')

Page({
  data: {
    // text:"这是一个页面"
    list: [],
    keyword:"",
    windowHeight: 0,//获取屏幕高度  
    page: 1,
    size: 20,
    hasMore: true,
    hasRefesh: false,
    type: 0, //0:全部，1：连载，2：完结
    orderby: 1 //1:人气，2：更新，3：收藏
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
  onLoad: function (options) {
    var that = this;
    that.initWindowHeight();
    wx.showLoading({
      title: '加载中',
      mark: true
    });
    var url = app.globalData.novelsUrl + `?pageIndex=1&pageSize=${that.data.size}&keyword=${options.keyword}&type=${that.data.type}&orderBy=${that.data.orderby}`;
    https.get(url,
      function (res) {
        that.setData({
          list: res.Data,
          keyword: options.keyword,
        });
        wx.hideLoading();
      }, function (res) {
        wx.hideLoading();
        console.log(res);
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
  selectType:function(e){
    var that = this;
     var type=e.currentTarget.dataset.type;
     console.log(type);
     that.setData({
       type: type,
     });
     that.refesh();
  },
  selectOrderBy: function (e) {
    var that=this;
    var type = e.currentTarget.dataset.type;
    console.log(type);
    that.setData({
      orderby: type,
    });
    that.refesh();
  },
  //点击事件处理
  clickDetail: function (e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}&category=${e.currentTarget.dataset.category}&title=${e.currentTarget.dataset.title}`
    });
  },
  //加载更多
  loadMore: function (e) {
    var that = this;
    that.setData({
      hasRefesh: true,
    });
    if (!this.data.hasMore) return
    console.log("loadMore");
    that.setData({
      hasMore: false
    });
    wx.showLoading({
      title: '加载中',
      mark: true
    });
    var page = that.data.page + 1;
    var url = app.globalData.novelsUrl + `?pageIndex=${page}&pageSize=${that.data.size}&keyword=${that.data.keyword}&type=${that.data.type}&orderBy=${that.data.orderby}`;
    https.get(url,
      function (res) {
        if (res.Data && res.Data.length > 0) {
          that.setData({
            list: that.data.list.concat(res.Data),
            hasRefesh: false,
            hasMore:true,
            page: page
          });
        }
        wx.hideLoading();
      }, function (res) {
        that.setData({
          hasMore:true
        });
        wx.hideLoading();
        console.log(res);
      })
  },
  //刷新处理
  refesh() {
    var that = this;
    that.setData({
      hasRefesh: true,
    });
    wx.showLoading({
      title: '加载中',
      mark: true
    });
    var url = app.globalData.novelsUrl + `?pageIndex=1&pageSize=${that.data.size}&keyword=${that.data.keyword}&type=${that.data.type}&orderBy=${that.data.orderby}`;
    https.get(url,
      function (res) {
        that.setData({
          list: res.Data,
          page: 1,
          hasRefesh: false,
        });
        wx.hideLoading();
      }, function (res) {
        wx.hideLoading();
        console.log(res);
      })
  },
})