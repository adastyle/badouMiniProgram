// pages/order/order.js
const app = getApp()
var common = require("../../resources/js/common.js");
Page({
  data: {
    pgrouponId: "",
    resourcePack: null,
  },
  goPay: function () {
    var that = this;
    common.osg.ajax('index/gopay', { "pgrouponId":that.data.pgrouponId}, function (data) {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success(res) {
          common.osg.open('../order/pay',{
            "payId": data.payId,            
          });
        },
        fail(res) {
          common.osg.toast('失败');
        },
        complete: function (res) {
          console.log("666666666666666666");
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.pgrouponId){
      this.setData({
        pgrouponId: options.pgrouponId,
      })
    }
    this.findResourcePack();    
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

  },

  findResourcePack: function () {
    var that = this;
    common.osg.ajax('index/findResourcePack', {
    }, function (data) {
      if (data.status == 1) {
        that.setData({
          resourcePack: data.data,
        })
                
      } else {
        
      }
    });
  },
  todetail: function () {
    common.osg.open('../index/index', {
      "pgrouponId": this.data.pgrouponId,
    });
  },
})