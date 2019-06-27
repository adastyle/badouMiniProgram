//index.js
//获取应用实例
const app = getApp()
var common = require("../../resources/js/common.js");
Page({
  data: {
    resourcePack: null,
    pgrouponId:"",
  },
  goTuan: function() {
    if (!this.data.resourcePack.pgroupon){
      common.osg.open('../order/order', {
        "pgrouponId": this.data.pgrouponId,
      });
    } else if (this.data.resourcePack.pgroupon){
      common.osg.open('../tuan/tuan', {
        "pgrouponId": this.data.pgrouponId,
      });
    }
    
  },
  onLoad: function(param) {
    common.osg.init(this, param);
    // 链接参数获取，flag参数值为123456，如:https://www.badou001.cn/wm/?flag=123456
    var q = common.osg.getQueryString('flag');
    if (q) {
      console.log('链接入参' + q);
      common.osg.alert("链接入参：" + q);
    }
    if (!common.osg.isLogined()) {
      common.osg.open('../authorize/authorize', null, {
        mode: 'redirect'
      });
      return;
    }
    if (param.pgrouponId){
      this.setData({
        pgrouponId: param.pgrouponId,
      })
    } else {      
      

    }
   
    this.findResourcePack();
    //common.osg.open('../tuan/tuan');
    //common.osg.open('../order/pay');
  },
  findResourcePack: function () {
    var that = this;
    common.osg.ajax('index/findResourcePack', {
      "pgrouponId": that.data.pgrouponId,
    }, function (data) {
      if (data.status == 1) {
         that.setData({
          resourcePack: data.data,
        })
        if (data.data.pgroupon){
          that.setData({
            pgrouponId: data.data.pgroupon._id,
          })
        }
        
      } else {
        
      }



    });

  }
})