// pages/tuan/tuan.js
const app = getApp()
var common = require("../../resources/js/common.js");
var total_micro_second;
Page({
  data: {
    showModal: false,
    showPost: false, // 控制弹出窗口显示海报
    showShare: false, // 控制弹出窗口显示分享
    showRule: false, // 控制弹出窗口显示规则
    // 生产海报图片数据定义
    data: {
      background: '/resources/images/post.jpg',
      width: '550rpx',
      height: '774rpx',
      // borderRadius: '20rpx',
      views: [{
        type: 'qrcode',
        content: common.osg.generateLinkMini({
          flag: '123456'
        }), // 二维码内容
        css: {
          bottom: '30rpx',
          right: '30rpx',
          width: '148rpx',
          height: '148rpx'
          // borderRadius: '96rpx'
        }
      }],    
    },
    pgrouponId: "",//团id
    resourcePack: null,    
    hour:"00",
    minutes:"00",
    second:"00",
    endDate2:''
  },

  // 禁止触摸滚动事件冒泡
  preventTouchMove: function() {},

  doHideModal: function() {
    this.setData({
      showModal: false,
      showPost: false,
      showShare: false,
      showRule: false
    });
  },

  goGenPoster: function() {
    // 生成并显示海报图片
    this.setData({
      showModal: true,
      showPost: true
    });
  },
  goShare: function() {
    this.setData({
      showModal: true,
      showShare: true
    });
  },
  goRule: function() {
    this.setData({
      showModal: true,
      showRule: true
    });
  },
  onImgOK(e) {
    // 成功生成海报图片
    this.imagePath = e.detail.path;
    console.log(e);
  },
  onImgErr(e) {
    // 生成海报图片失败
  },
  doSavePosterImage() {
    var that = this;
    // 保存海报图片到手机相册
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success: function() {
        common.osg.toast('保存成功');
        that.doHideModal();
      },
      fail: function(e) {
        common.osg.toast('保存取消');
        that.doHideModal();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      pgrouponId: options.pgrouponId,
      
    })    
    this.findResourcePack();    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '《三字经》课程畅享',
      path: '/pages/tuan/tuan?pgrouponId=' + this.data.pgrouponId,
      success: function (res) {
        common.osg.toast('分享成功');
      }
    }
  },
  todetail: function () {
    common.osg.open('../index/index', {
      "pgrouponId": this.data.pgrouponId,
    });   
  },
  findResourcePack: function () {
    var that = this;
    common.osg.ajax('index/findResourcePack', {
      "pgrouponId": that.data.pgrouponId,
    }, function (data) {
      if (data.status == 1) {
        that.setData({
          resourcePack: data.data,
          endDate2: data.data.pgroupon.dueTime,
        })
        if (data.data.pgroupon && data.data.pgroupon.state==0){
          that.countTime();
        }
        
        
      } else {
        
      }



    });
  },
  goOrder: function () {
    var pgroupon = this.data.resourcePack.pgroupon;
    if (pgroupon.state == 0){
      if (pgroupon.hasCurrentUser==0){
        common.osg.open('../order/order', {
          "pgrouponId": this.data.pgrouponId,
        });
      }else{
        wx.showToast({
          title: '您已参团，快去邀请好友吧！',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
      
    } else if (pgroupon.state == 1){
      if(pgroupon.hasCurrentUser == 0){
        common.osg.open('../order/order');
      }else{
        wx.showToast({
          title: '拼团成功，快去八斗国学app畅听国学吧！',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    } else if (pgroupon.state == -1){
      common.osg.open('../order/order');
    }
    
   
  },
  countTime() {
    
    var that = this;
    var date = new Date();
    var now = date.getTime();    
    var endDate = new Date(that.data.endDate2);//设置截止时间
    var end = endDate.getTime();
    var leftTime = end - now; //时间差              
    var d, h, m, s, ms;
    if (leftTime >= 0) {
      // 秒数
      var second = Math.floor(leftTime / 1000);      
      h = Math.floor(second / 3600);
      m = Math.floor((second - h * 3600) / 60);
      s = second - h * 3600 - m * 60;       
      s = s < 10 ? "0" + s : s
      m = m < 10 ? "0" + m : m
      h = h < 10 ? "0" + h : h
      that.setData({
        hour: h,
        minutes: m,
        second: s,
      })
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(that.countTime, 1000);
    } else {      
      that.setData({
        hour: "00",
        minutes: "00",
        second: "00",
      })
    }

  },

 
  

})
