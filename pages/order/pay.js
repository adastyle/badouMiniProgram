// pages/order/pay.js
var common = require("../../resources/js/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    out_trade_no:"",
    price:"",
    pgrouponId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.setData({
      out_trade_no: options.payId,      
    })
    this.queryPay();
    console.log(this.data.out_trade_no);
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
  queryPay: function () {
    var that = this;
    common.osg.ajax('index/queryPay', { "payId": that.data.out_trade_no }, function (data) {
      if(data){
        that.setData({
          price: data.data.price,
          pgrouponId: data.data.orderIds[1],
        })
      }
      
      console.log(that.data.out_trade_no + that.data.price + "pgrouponId=" + that.data.pgrouponId);
    });
  },
  toTuan: function () {
    common.osg.open('../tuan/tuan', {
      "pgrouponId": this.data.pgrouponId,
    });
  }
})