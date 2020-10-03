import https from 'https.js';


function getLoginUrl(code, userInfo) {
  var url = "";
  if (userInfo) {
    var nickName = userInfo.nickName;
    var avatarUrl = userInfo.avatarUrl;
    var gender = userInfo.gender;
    var language = userInfo.language;
    url = `https://api.stiles.cc/wechat/onLogin?code=${code}&nickName=${nickName}&avatarUrl=${avatarUrl}&gender=${gender}&language=${language}`;
  }
  else {
    url = `https://api.stiles.cc/wechat/onLogin?code=${code}`;
  }
  return url;
}
function Login(code, userInfo) {
  var url = getLoginUrl(code, userInfo);
  let promise = new Promise(function (resolve, reject) {
    return https.get(url, function (res) {
      var token = res.token;
      wx.setStorageSync('token', token);
      resolve(res);
    }, function (res) {
      //wx.setStorageSync('token', "defalutToken")
      // 在这里你要考虑到用户登录失败的情况 
      reject(res);
    }, false)
  });
  return promise;
}
function trySettingToken() {
  var app = getApp();
  let promise = new Promise(function (resolve, reject) {
    var token = wx.getStorageSync('token');
    if (token) {
      resolve();
      return;
    }
    wx.login({
      success: function (res) {
        //登录成功 
        if (res.code) {
          // 这里是用户的授权信息每次都不一样 
          var code = res.code;
          var userInfo = app.globalData.userInfo;
          Login(code, userInfo).then(resolve);
        }
      }, fail: function (res) {
        console.log("wx.login fail");
        console.log(res);
        reject(res);
      }
    })
  });
  return promise;
}
function getUserInfo() {
  var app = getApp();
  let promise = new Promise(function (resolve, reject) {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      app.globalData.userInfo = userInfo;
    }
    if (app.globalData.userInfo) {
      resolve();
    } else {
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo;
          wx.setStorageSync('userInfo', userInfo);
          app.globalData.userInfo = userInfo;
          resolve();
        }, fail: function (res) {
          console.log("没有授权，userInfo is null");
          console.log(res);
          reject();
        }
      });
    }
  });
  return promise;
}

module.exports = {
  trySettingToken: trySettingToken,
  getUserInfo: getUserInfo
}