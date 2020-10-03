import util from 'util.js';
import time from 'time.js';
import random from 'random.js';
import sha1 from 'sha1.js';

var Secret ="6CBE9BAF";

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function get(url, success, fail, setVerificationParam = true ) {
  if (setVerificationParam){
    url = rewrite(url);
  }
  wx.request({
      url: url,
      header: {
          //'Content-Type': 'application/json'
      },
      success: function( res ) {
        success(res.data);
      },
      fail: function( res ) {
          fail( res );
      }
  });
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function post(url, data, success, fail, setVerificationParam = true) {
  if (setVerificationParam){
      url = rewrite(url);
    }
     wx.request( {
        url: url,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        method:'POST',
        data:{data: data},
        success: function( res ) {
            success( res.data );
        },
        fail: function( res ) {
            fail( res );
        }
    });
}

function rewrite(url){
  var token = getToken();
  var timeStamp = time.getCurrentTimestamp();
  var nonceStr = random.getRandomNum(100000, 999999);
  var sign = sha1.hex_sha1(token + timeStamp + nonceStr + Secret).toLowerCase();
  if (url.indexOf("?") > -1) {
    url += `&token=${token}&nonceStr=${nonceStr}&sign=${sign}&timeStamp=${timeStamp}`;
  } else {
    url += `?token=${token}&nonceStr=${nonceStr}&sign=${sign}&timeStamp=${timeStamp}`;
  }
  return url;
}

function getToken(){
  var app = getApp()
  var token = app.globalData.token;
  if(!token){
    token=wx.getStorageSync('token');
    if(!token){
      var token = randomString(22);
      wx.setStorageSync('token', token);
    }
    app.globalData.token=token;
  }
  return token;
}

function randomString(len) {
  　　len = len || 32;
  　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  　　var maxPos = chars.length;
  　　var str = '';
  　　for (var i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos));
  　　}
      return str;
}

module.exports = {
    get: get,
    post:post,
}
