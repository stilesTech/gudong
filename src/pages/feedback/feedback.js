var app = getApp()
var https = require('../../utils/https.js')

Page({
  data: {
    height: 20,
    focus: true,
    hasReq:false
  },
  formSubmit: function (e) {
    var that=this;
    if (e.detail.value.content){
      var url = app.globalData.feedbackUrl + `?content=${e.detail.value.content}`;
      
      if (that.data.hasReq==true){
         return;
      }
      that.setData({
        hasReq: true
      })
      https.get(url,
        function (res) {
          that.setData({
            hasReq: false
          })
          wx.showModal({
            title: '',
            content: '提交成功',
            showCancel: false,
          })
        }, function (res) {
          that.setData({
            hasReq: false
          })
          wx.showModal({
            title: '',
            content: '提交失败',
            showCancel: false,
          })
        });
    }
  }
})