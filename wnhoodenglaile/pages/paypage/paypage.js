var app = getApp();
var Util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * <支付>按键 -- 调用微信支付功能，成功则跳转到控制界面，失败则保持原界面
   */
  pay_button: function () {

    var code = app.code;
    var resultStr = {};
    var resData = {};

    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.code = res.code;

          var data = "{\"time\":\"600000\",\"totalFee\":\"1\",\"code\":\""
          data += that.code;
          data += "\"}";

          var urlStr = 'https://api.wnhoo.com/smart/wxpay/goPay?'
          urlStr += Util.json2Form({ data });
          
          console.log('paypage code : ' + that.code);
          console.log(urlStr);

          wx.request({
            url: urlStr,
            header: {
              "Content-Type": "x-www-form-urlencoded"
            },
            method: "POST",
            success: function (res) {
              console.log('code发送服务器成功，返回支付五参 : ');
              console.log(res);
              resultStr = res.data.msg;
              resData = JSON.parse(resultStr);
              console.log(resData);

              // 微信支付接口调用
              wx.requestPayment({
                timeStamp: resData.timeStamp.toString(),
                nonceStr: resData.nonceStr,
                package: resData.package,
                signType: 'MD5',
                paySign: resData.paySign,
                success: function (res) {
                  console.log('支付成功！！！！');
                  app.globalData.lastCtlTime = 600;
                  console.log("splash页面 剩余时间为 : " + app.globalData.lastCtlTime);
                  // 微信支付成功，跳转到控制界面.。
                  wx.redirectTo({
                    url: '/pages/controlpage/controlpage',
                    success: function (res) {
                      console.log("跳转到控制界面成功.。");
                    },
                    fail: function (res) {
                      console.log("跳转到控制界面失败...");
                    },
                    complete: function (res) { },
                  })
                },
                fail: function (res) {
                  console.log('支付失败....');
                },
                complete: function (res) { },
              })
            },
            fail: function (res) {
              console.log('code发送服务器失败。。。');
            },
            complete: function (res) { },
          });
        } else {
          console.log('获取用户登陆态失败！' + res.errMsg);
        }
      }
    })

    //微信支付成功，跳转到控制界面.。
    // wx.redirectTo({
    //   url: '/pages/controlpage/controlpage',
    //   success: function (res) {
    //     console.log("跳转到控制界面成功.。");
    //   },
    //   fail: function (res) {
    //     console.log("跳转到控制界面失败...");
    //   },
    //   complete: function (res) { },
    // })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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