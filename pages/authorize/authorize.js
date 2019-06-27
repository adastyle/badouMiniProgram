const app = getApp();
var common = require("../../resources/js/common.js");
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function(param) {
    var that = this;
    common.osg.init(this, param);
    // 未登录，查看是否已经授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              that.doLogin(res);
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      this.doLogin(e.detail);
    } else {
      //用户按了拒绝按钮
      common.osg.confirm('您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!', function(res) {
        if (res.confirm) {
          console.log('用户点击了“返回授权”')
        }
      });
    }
  },
  doLogin: function(res) {
    var that = this;
    wx.login({
      success: r => {
        var code = r.code;
        if (code) {
          common.osg.ajax('index/login', {
            "code": code,
            "iv": res.iv,
            "encryptedData": res.encryptedData
          }, function(data) {
            data = data.data;
            common.osg.currentUserSet(data);
            that.goIndex();
          });
        }
      }
    });
  },
  goIndex: function() {
    common.osg.open('../index/index');
  }
})