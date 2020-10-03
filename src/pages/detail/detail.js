var app = getApp()
var https = require('../../utils/https.js')
var util = require('../../utils/util.js')
import { BookShelfInfo } from '../../model/BookShelfInfo.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    visible:false,
    scrolly:true,
    item:{},
    showCatelog: false,
    catelogs:{},
    recList:{},
    inBookshelf:false,
    showMoreDesc:false,
    showMoreText:'更多介绍',
    windowHeight: 0,//获取屏幕高度  
  },
  initWindowHeight: function () {
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
  showDesc:function(e){
    this.setData({
      showMoreDesc: !this.data.showMoreDesc,
      showMoreText: this.data.showMoreDesc ? '更多介绍' :'收起介绍'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
     var that = this;
     that.initWindowHeight();
     var inBookshelf=false;
     if (wx.getStorageSync("book"+option.id)){
       inBookshelf = true;
     }
     showCatelog: (option.showCatelog == "true" ? true : false)
     let url = app.globalData.detailUrl + `?id=${option.id}`;
     wx.showLoading({
       title: '加载中',
       mark: true
     });
     https.get(url,function(res){
      if(res){
        res.Data.UpdateTime = util.convertToTime(res.Data.UpdateTime);
      }
      that.setData({
          item:res.Data,
          visible:true,
          id:option.id,
          inBookshelf: inBookshelf
       })
      wx.hideLoading();
     },function(){
       wx.hideLoading();
     })
     url = app.globalData.recommendUrl + `?category=${option.category}&keyword=${option.title}`
     https.get(url, function (res) {
       that.setData({
         recList: res.Data,
         visible: true,
       })
     })
  },
  refreshCatelog:function(){
    var that = this;
    that.initCatelog(that.data.id);
  },
  sortCatelog:function(){
    var that = this;
    var catelogs = that.data.catelogs;
    that.setData({
      catelogs: catelogs.reverse()
    });
  },
  initCatelog: function (nid) {
    var that = this;
    let url = app.globalData.chaptersUrl + `?nid=${nid}`
    wx.showLoading({
      title: '加载中',
      mark: true
    });
    https.get(url, function (res) {
      that.setData({
        catelogs: res.Data
      });
      wx.hideLoading();
    }, function () { wx.hideLoading();});
  },
  //点击事件处理
  clickDetail: function (e) {
    wx.redirectTo({
      url: `./detail?id=${e.currentTarget.dataset.id}&category=${e.currentTarget.dataset.category}&title=$          {e.currentTarget.dataset.title}`
    });
  },
  changeShowCatelog:function(e){
    var that = this;
    that.setData({
      showCatelog: !that.data.showCatelog,
      scrolly: that.data.showCatelog
    }) 
    if (that.data.showCatelog) {
      that.initCatelog(that.data.id);
    }
  },
  toReader:function(e){
    var that = this;
    let serialNumber='1';
    if (e.currentTarget.dataset.serialnumber){
      serialNumber = e.currentTarget.dataset.serialnumber;
    }
    wx.navigateTo({
      url: `../reader/reader?id=${that.data.id}&serialNumber=${serialNumber}&title=${that.data.item.Title}`
    });
  },
  insertBookShelf: function () {
    var that = this;
    var item=that.data.item;
    var info = new BookShelfInfo(that.data.id, item.Title,
      item.Icon, 1, "", item.Category, item.LatestSerialNumber, item.LatestChapterName,util.formatDate(new Date()));
      
    wx.setStorage({
      key: "book"+that.data.id,
      data:info,
      success:function(){
        wx.showToast({
          title: '已加入书架',
        })
        that.setData({
          inBookshelf: true
        })
      }
    });
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