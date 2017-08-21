
//获取应用实例
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * <立即进入>按键，跳转到支付界面
   */
  splash_button:function(){

    // registerUser(userInfo.nickName, '12345678');
    // loginUser(userInfo.nickName, '12345678');

    this.registerUser(this.data.userInfo.nickName, '12345678');
    this.loginUser(this.data.userInfo.nickName, '12345678');

    wx.redirectTo({
      url: '/pages/paypage/paypage',
      success: function(res) {
        console.log("跳转支付界面成功.。")
      },
      fail: function(res) {
        console.log("跳转支付界面失败....")
      },
      complete: function(res) {},
    })
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
      url: 'https://api.wnhoo.com/smart/user/register',
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
      url: 'https://api.wnhoo.com/smart/user/login',
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
        console.log(res)
        app.globalData.token = res.data.token
      },
      fail: function (res) {
        console.log('Sorry, 登陆失败...')
      },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    var code = app.code;
    console.log('这是code :')
    console.log(code);

    console.log("二维码中传入的参数options : ");
    console.log(options);
    if (options.gatewayID){
      app.globalData.gatewayID = options.gatewayID;
      app.globalData.deviceID = options.deviceID;
      console.log("接收到参数gatewayID 和 deviceID ");
      console.log("app.gatewayID : " + app.globalData.gatewayID);
      console.log("app.deviceID : " + app.globalData.deviceID);
    } else {
      console.log("-------oops, 没有接收到参数哦！！！！");
    }
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
    
  }
})