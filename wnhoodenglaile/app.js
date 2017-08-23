//app.js
App({
  code: null,
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //微信支付
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.code = res.code;
          console.log('app.js中得到的code : ');
          console.log(res.code);
        } else {
          console.log('获取用户登陆态失败！' + res.errMsg);
        }
      }
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          console.log(res);
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })

      // 初始化控制灯的参数
      // registerUser(res.userInfo.nickName, '12345678');
      // loginUser(res.userInfo.nickName, '12345678');
      // 测试网关1
      // that.globalData.productCode = "wnhooDDTest001";
      // that.globalData.gatewayID = "1010a020a61057f6";
      // that.globalData.deviceID = "BB13";
      // 测试网关2
      that.globalData.productCode = "wnhooDDTest001";
      that.globalData.gatewayID = "1010a020a6014707";
      that.globalData.deviceID = "85D8";
      // that.globalData.deviceID = "094b";
          // that.globalData.deviceID = "74df";
          // 测试网关3
          // that.globalData.productCode = "wnhooDDTest001";
          // that.globalData.gatewayID = "101018fe34cea5ce";
          // that.globalData.deviceID = "BB17";
    }
  },

  /**
   * 注册万互共享照明账户--测试使用，固定用户为test_666，密码为12345678
   */
  registerUser: function (userName, passWord) {

    console.log(userName);
    console.log(passWord);

    var ts = Date.parse(new Date());
    ts = ts / 1000;
    console.log("当前时间戳为：" + ts);
    wx.request({
      url: 'https://api.wnhoo.com:443/smart/user/register',
      data: {
        username: userName,
        password: passWord,
        timestamp: ts,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('用户创建成功！！！')
      },
      fail: function (res) {
        console.log('创建万互用户失败了')
      },
      complete: function (res) {

      },
    })
  },

  /**
   * 使用测试固定用户test_666登录,接收返回的token
   */
  loginUser: function (userName, passWord) {
    var ts = Date.parse(new Date());
    ts = ts / 1000;
    console.log("当前时间戳为：" + ts);
    wx.request({
      url: 'https://api.wnhoo.com:443/smart/user/login',
      data: {
        username: userName,
        password: passWord,
        timestamp: ts,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('登陆成功!!!')
      },
      fail: function (res) {
        console.log('Sorry, 登陆失败...')
      },
      complete: function (res) { },
    })
  },

  globalData: {
    userInfo: null,
    token: '',
    productCode: '',
    gatewayID: '',
    deviceID: '',
    lastCtlTime:0
  }
})
