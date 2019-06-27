// 生产服务器地址
//var _host = "https://www.badou001.cn";

// 本地开发地址
var _host = 'https://dev.badou001.cn';
//var _host = 'https://minidev.caihongjiankang.com'

var rootUri = _host + "/badou/wm/";

// 普通链接打开小程序，二维码链接规则前缀
var linkMiniPrefix = _host + "/wm/";

// 是否debug模式
var debug = true;

// 缓存相关key
var cacheKeys = {
  user: '_currentUser',
  settings: '_settings'
};

var osg = {
  "login": rootUri + "index/main",
  app: null,
  _cthis: null,
  _param: null,
  init: function(t, p, a) {
    var that = this;
    this._cthis = t;
    this._param = p;
    this.app = a;
    if (t) {
      t.evtCallListener = function(d) {
        that.evtCallListener(d);
      };
    }
  },
  // 事件机制实现
  evtCallbacks: [],
  /**
   * 注册事件监听 
   * @param {Object} func
   */
  evtAddListener: function(func) {
    this.evtCallbacks.push(func);
  },
  /**
   * 调用当前webview所有事件监听回调
   * @param {Object} d
   */
  evtCallListener: function(d) {
    for (var i = 0; i < this.evtCallbacks.length; i++)
      this.evtCallbacks[i](d);
  },
  /**
   * 触发所有webview的事件监听
   * @param {Object} d
   */
  evtFireEvent: function(d) {
    var wvs = getCurrentPages();
    for (var i = 0; i < wvs.length; i++) {
      var wv = wvs[i];
      if (wv.evtCallListener)
        wv.evtCallListener(d);
    }
  },
  /**
   * 退出当前用户登陆
   */
  logout: function() {
    this.currentUserSet(null);
    this.evtFireEvent('logout');
  },

  /**
   * 获取用户设置存储
   * 
   * @return {Object} 用户设置存储对象
   */
  setting: function() {
    return this.getObj(cacheKeys.settings) || {};
  },

  /**
   * 获取用户设置某个key的值
   * 
   * @param {Object} key
   * @return {String} 指定key的用户设置值
   */
  settingValue: function(key) {
    return this.setting()[key];
  },

  /**
   * 设置用户设置选项
   * 
   * @param {Object} key
   * @param {Object} val
   */
  settingSet: function(key, val) {
    var s = this.setting();
    s[key] = val;
    this.set(cacheKeys.settings, s);
  },

  /*c
   * 删除用户设置选项
   * 
   * @param {Object} key
   */
  settingRemove: function(key) {
    var s = this.setting();
    delete s[key];
    this.set(cacheKeys.settings, s);
  },

  /**
   * 获取本地持久化存储数据，Object格式
   * 
   * @param {Object} key
   * @return {Object} 根据key获取持久化存储value对象格式
   */
  getObj: function(key) {
    var s = this.get(key);
    // if (s)
    //   s = JSON.parse(s);
    return s;
  },

  /**
   * 获取本地持久化存储数据，String格式
   * 
   * @param {Object} key
   * @return {String} 根据key获取持久化存储value字符串格式
   */
  get: function(key) {
    return wx.getStorageSync(key);
  },

  /**
   * 设置本地持久化存储数据，Object类型值将转换为JSON格式字符串存储
   * 
   * @param {Object} key
   * @param {Object} val
   */
  set: function(key, val) {
    if (!val)
      wx.removeStorageSync(key);
    else {
      wx.setStorageSync(key, val);
    }
  },

  /**
   * 当前是否已登陆
   */
  isLogined: function() {
    var u = this.currentUser();
    if (u && u._id)
      return true;
    else
      return false;
  },

  /**
   * 获取当前登陆用户信息
   * 
   * @return {Object}
   * @return {Object} 当前登录用户对象
   **/
  currentUser: function() {
    var u = this.getObj(cacheKeys.user);
    if (u) {
      return u.user;
    }
    return u;
  },
  /**
   * 获取当前登陆用户token信息
   * 
   * @return {Object}
   * @return {Object} 当前登录用户token信息
   **/
  currentToken: function() {
    var u = this.getObj(cacheKeys.user);
    if (u) {
      return u.token;
    }
    return u;
  },

  /**
   * 持久化存储当前登录用户信息对象
   * 
   * @param {Object} u
   */
  currentUserSet: function(u) {
    return this.set(cacheKeys.user, u);
  },

  /**
   * 网络连接api
   * 
   * @param {Object} url 网络请求的url，'~'开头则保留原始url
   * @param {Object} data
   * @param {Object} callback
   * @param {Object} options
   * 		-method 		GET or POST
   * 		-noload 		是否不显示加载中
   *    -header     请求头信息数据
   */
  ajax: function(url, data, callback, options) {
    var options = options || {};
    var method = options.method,
      noload = options.noload;
    var data = data || {};

    if (!url.startsWith('~')) {
      if (url.startsWith('/'))
        url = url.substring(1);
      url = rootUri + url;
    } else {
      url = url.substring(1);
    }

    var method = method || 'POST';
    var dataType = "json";
    var responseType = "text";
    var success = callback || function() {};
    var fail = options.fail || function() {};
    var complete = options.complete || function() {};

    var header = {} || options.header;
    if (method == 'POST') {
      header = Object.assign({
        "Content-Type": "application/x-www-form-urlencoded"
      }, header);
    } else {
      header = Object.assign({
        "Content-Type": "application/json"
      }, header);
    }
    let sessionId = this.currentToken();
    if (sessionId) {
      header = Object.assign({
        "Cookie": "JSESSIONID=" + sessionId
      }, header);
    }

    if (!noload)
      this.loading();

    let _this = this;

    if (debug) {
      console.log(method + ';' + (sessionId ? ("sessionId=" + sessionId + ";") : "") + url);
      var ds = JSON.stringify(data);
      if (ds != '{}')
        console.log(ds);
    }

    wx.request({
      url: url,
      data: data,
      header: header,
      method: method,
      dataType: dataType,
      responseType: responseType,
      success: function(data) {
        if (data.statusCode == 200) {
          data = data.data;
          if (debug)
            console.log('请求返回：' + JSON.stringify(data));
          if (data && data.message && !data.success) {
            _this.alert(data.message);
          } else
            success(data);
        } else if (data.statusCode == 500)
          _this.alert('服务端错误！');
        else
          _this.alert(data.errMsg);
      },
      fail: function(res) {
        fail(res);
        console.log('请求失败：' + JSON.stringify(res));
      },
      complete: function() {
        complete();
        if (!noload)
          _this.unload();
      }
    });

  },
  /**
   * toast消息组件
   * 
   * @param {Object} msg
   */
  toast: function(msg) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 2000
    });
  },

  /**
   * alert提示框组件
   * 
   * @param {Object} msg
   * @param {Object} callback
   */
  alert: function(msg, callback) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          if (callback) callback();
        } else if (res.cancel) {}
      }
    });
  },

  /**
   * confirm确认框组件
   * 
   * @param {Object} msg
   * @param {Object} callback
   */
  confirm: function(msg, callback) {
    wx.showModal({
      title: '确认',
      content: msg,
      success(res) {
        if (res.confirm) {
          if (callback) callback();
        } else if (res.cancel) {}
      }
    });
  },
  /**
   * 显示加载中
   * 
   * @param {Object} msg
   */
  loading: function(msg) {
    if (!msg)
      msg = "处理中...";
    wx.showLoading({
      title: msg,
    });
  },
  /**
   * 隐藏加载中
   */
  unload: function() {
    wx.hideLoading();
  },
  /**
   * 打开新窗口
   * 
   * @example osg.open('regist.html');
   * 
   * @param {Object} url
   * @param {Object} data 打开窗口传参
   * @param {Object} options
   * 		-mode 		打开窗口模式，redirect为关闭当前窗口打开新窗口，默认：navigate
   */
  open: function(url, data, options) {
    if (!options)
      options = {};
    var mode = options.mode || 'navigate';
    var d = '';
    if (data) {
      for (var v in data) {
        d += encodeURI(v) + '=' + encodeURI(data[v]) + '&';
      }
    }
    if (d.endsWith('&'))
      d = d.substring(0, d.length - 1);
    if (url.indexOf('?') == -1)
      url += '?';
    else
      url += '&';
    url += d;
    if (mode == 'navigate') {
      wx.navigateTo({
        url: url
      })
    } else if (mode == 'redirect') {
      wx.redirectTo({
        url: url
      })
    }

  },
  /**
   * 关闭窗口
   */
  closeMe: function(d) {
    if (!d)
      d = 1;
    wx.navigateBack({
      delta: d
    })
  },
  /**
   * 获取传入页面参数
   * 
   * @param {Object} key
   */
  param: function(key) {
    var data = this._param;
    if (data)
      return data[key];
    else
      return null;
  },
  getQueryString: function(name) {
    var p = this._param;
    if (p && p.q) {
      const url = decodeURIComponent(p.q);
      var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
      var r = url.substr(1).match(reg)
      if (r != null) {
        return r[2]
      }
    }
    return null;
  },
  generateLinkMini(data) {
    var url = linkMiniPrefix + '?';
    var d = '';
    if (data) {
      for (var v in data) {
        d += encodeURI(v) + '=' + encodeURI(data[v]) + '&';
      }
    }
    if (d.endsWith('&'))
      d = d.substring(0, d.length - 1);
    return url + d;
  }
};

module.exports.osg = osg;