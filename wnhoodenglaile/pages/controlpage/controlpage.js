
//获取应用实例
var app = getApp()
var Util = require('../../utils/util.js');

var xStart = 0;
var yStart = 0;
var distance = 0;
var plateAngle = 0.0; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNotControl:true,
    animation: '',
    screenHeight: 0,
    screenWidth: 0,
    startColor : 0x82ff00,
  },

  /**
   * <开灯图标> -- 进入控制页面
   */
  turnOnControl:function(){

    this.turnOnUser(app.globalData.token, app.globalData.gatewayID, app.globalData.deviceID);

    this.setData({
      isNotControl:false,
    })
  },

  /**
   * <关闭灯图标> -- 退出控制页面
   */
  returnStartControlPage:function(){
    this.turnOffUser(app.globalData.token, app.globalData.gatewayID, app.globalData.deviceID);
    this.setData({
      isNotControl: true,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化变量
    this.plateAngle = 0.0;
    this.xStart = 0;
    this.yStart = 0;
    this.distance = 0;

    //获取屏幕宽高
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });

    this.connectUser(app.globalData.token, app.globalData.productCode, app.globalData.gatewayID);
  },

  /**
   * 关联测试网关 -- 1010a020a61057f6
   */
  connectUser: function (mtoken, productCode, gatewayID) {

    var data = "{\"token\":\"";
    data += mtoken;
    data += "\",\"product_code\":\""
    data += productCode;
    data += "\",\"gateway_id\":\""
    data += gatewayID;
    data += "\"}";
    
    var urlStr = 'https://api.wnhoo.com/smart/soa_devices/code_add?'
    urlStr += Util.json2Form({ data })
    console.log(urlStr);

    wx.request({
      url: urlStr,
      header: {
        "Content-Type": "x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log('设备添加成功！！！');
        console.log(res);
      },
      fail: function (res) {
        console.log('Sorry, 设备添加失败...');
      },
      complete: function (res) {

      },
    })
  },

  /**
   * 打开灯
   */
  turnOnUser: function (mToken, gatewayID, deviceID) {
    var ts = Date.parse(new Date());
    ts = ts / 1000;
    var deviceCtlStr = deviceID;
    deviceCtlStr += ';1';
    wx.request({
      url: 'https://api.wnhoo.com/smart/sensors/send_push',
      header: {
        "Content-Type": "x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({ token: mToken, device_id: gatewayID, sensor_id: 'S61', sensor_type: 1, timestamp: ts, data: deviceCtlStr }),
      success: function (res) {
        console.log('打开LED灯成功！');
        console.log(res);
      },
      fail: function (res) {
        console.log('Sorry, 打开LED灯失败...');
      },
      complete: function (res) {

      },
    })
  },

  /**
   * 关闭灯
   */
  turnOffUser: function (mToken, gatewayID, deviceID) {
    var ts = Date.parse(new Date());
    ts = ts / 1000;
    var deviceCtlStr = deviceID;
    deviceCtlStr += ';0';
    wx.request({
      url: 'https://api.wnhoo.com/smart/sensors/send_push',
      header: {
        "Content-Type": "x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({ token: mToken, device_id: gatewayID, sensor_id: 'S61', sensor_type: 1, timestamp: ts, data: deviceCtlStr }),
      success: function (res) {
        console.log('关闭LED灯成功！');
        console.log(res);
      },
      fail: function (res) {
        console.log('Sorry, 关闭LED灯失败...');
      },
      complete: function (res) {

      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    //实例化一个动画
    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 0,
      timingFunction: 'linear',
      // 延迟多长时间开始
      delay: 0,
      transformOrigin: 'left top 50%',
      success: function (res) {
        //console.log(res)
      }
    })
  },

  /**
   * 记录用户滑动的起始坐标点
   */
  touchStartFN: function (events) {
    // console.log(events);
    this.xStart = events.touches[0].pageX;
    this.yStart = events.touches[0].pageY;
  },

  /**
   * 触摸旋转
   */
  touchMoveFN: function (events) {
    var xMove = events.touches[0].pageX;
    var yMove = events.touches[0].pageY;

    this.distance = yMove - this.yStart;
    this.yStart = yMove;

    var mPlateAngle = (this.distance * 360 / 150);
    // console.log('当次移动距离 : ' + this.distance);
    // console.log('当次旋转角度 : ' + mPlateAngle);

    // console.log('屏幕的1/2宽度为 : ' + this.data.screenWidth / 2);

    if (xMove > this.data.screenWidth / 2) {
      // 屏幕右半边
      // 设置圆盘旋转角度
      this.plateAngle = this.plateAngle + mPlateAngle;
      // 设置颜色变化 B60B 由 FFFFFF/360 得来
      if (mPlateAngle > 0) { 
        this.data.startColor -= Math.abs(parseInt(mPlateAngle * 0xB60B));
      } else {
        this.data.startColor += Math.abs(parseInt(mPlateAngle * 0xB60B));
      }
      // console.log('屏幕右边');
    } else {
      // 屏幕左半边
      // 设置圆盘旋转角度
      this.plateAngle = this.plateAngle - mPlateAngle;
      // 设置颜色变化
      if (mPlateAngle > 0) {
        this.data.startColor += Math.abs(parseInt(mPlateAngle * 0xB60B));
      } else {
        this.data.startColor -= Math.abs(parseInt(mPlateAngle * 0xB60B));
      }
      // console.log('屏幕左边边');
    }

    if (this.plateAngle > 0){
      this.plateAngle = this.plateAngle%360;
    } else {
      var currentAngle = Math.abs(this.plateAngle);
      currentAngle = currentAngle % 360;
      this.plateAngle = 360 - currentAngle;
    }

    // // 防止颜色值溢出,将范围控制在 0 - 0xFFFFFF 之间
    // if (this.data.startColor > 0xFFFFFF){
    //   this.data.startColor = this.data.startColor % 0xFFFFFF;
    // } else if (this.data.startColor < 0){
    //   this.data.startColor = 0xFFFFFF + this.data.startColor;
    // }

    // 颜色设置
    var redColor = 0;
    var greenColor = 0;
    var blueColor = 0;
    if ((this.plateAngle >= 330) && (this.plateAngle < 30)){
      // 绿黄区间 -- redColor增加or减少 greenColor固定为255 blueColor固定为0
      if (this.plateAngle >= 330){
        // 330~360 : redColor增加
        var tempValue = 0;
        tempValue = 360 - this.plateAngle;
        // 4.25 表示为 颜色区间255/区间角度60度 的比值
        redColor = parseInt(130 + tempValue * 4.25);
      } else {
        redColor = parseInt(130 - this.plateAngle * 4.25);
      }
      greenColor = 255;
      blueColor = 0;
    } else if ((this.plateAngle >= 30) && (this.plateAngle < 90)){
      // 绿青区间 -- redColor为0 greenColor为255 blueColor为增量
      var tempValue = 0;
      tempValue = this.plateAngle - 30;
      redColor = 0;
      greenColor = 255;
      blueColor = parseInt(tempValue * 4.25);
    } else if ((this.plateAngle >= 90) && (this.plateAngle < 150)){
      // 青蓝区间 -- redColor为0 greenColor为减量 blueColor为255
      var tempValue = 0;
      tempValue = this.plateAngle - 90;
      redColor = 0;
      greenColor = 255 - parseInt(tempValue * 4.25);
      blueColor = 255;
    } else if ((this.plateAngle >= 150) && (this.plateAngle < 210)) {
      // 蓝粉区间 -- redColor为增量 greenColor为0 blueColor为255
      var tempValue = 0;
      tempValue = this.plateAngle - 150;
      redColor = parseInt(tempValue * 4.25);
      greenColor = 0;
      blueColor = 255;
    } else if ((this.plateAngle >= 210) && (this.plateAngle < 270)) {
      // 粉红区间 -- redColor为255 greenColor为0 blueColor为减量
      var tempValue = 0;
      tempValue = this.plateAngle - 210;
      redColor = 255;
      greenColor = 0;
      blueColor = 255 - parseInt(tempValue * 4.25);
    } else{
      // 红黄区间 -- redColor为255 greenColor为增量 blueColor为0
      var tempValue = 0;
      tempValue = this.plateAngle - 270;
      redColor = 255;
      greenColor = parseInt(tempValue * 4.25);
      blueColor = 0;
    }

    this.data.startColor = (redColor << 16) + (greenColor << 8) + blueColor;

    // 旋转动画设置
    // console.log('当前角度 :' + this.plateAngle);
    this.animation.rotate(this.plateAngle).step();
    this.setData({
      //输出动画
      animation: this.animation.export()
    })

    // 发送调色指令
    console.log('当前角度 : ' + this.plateAngle);
    console.log('red :' + redColor + ', green : ' + greenColor + ', blue : ' + blueColor);
    console.log('当前颜色 : ' + this.data.startColor.toString(16));
    this.slider_ctl_color(app.globalData.token, app.globalData.gatewayID, app.globalData.deviceID, this.data.startColor.toString(16));
  },

  slider_ctl_color: function (mtoken, gatewayID, deviceID, color) {
    //console.log(res.detail.value);

    var ts = Date.parse(new Date());
    ts = ts / 1000;

    var controlStr = '';
    controlStr += deviceID;
    controlStr += ";01";
    controlStr += color;
    controlStr += "00ff";

    wx.request({
      url: 'https://api.wnhoo.com/smart/sensors/send_push',
      header: {
        "Content-Type": "x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({ token: mtoken, device_id: gatewayID, sensor_id: 'S62', sensor_type: 1, timestamp: ts, data: controlStr}),
      success: function (res) {
        console.log('调节LED灯成功！');
        // console.log(res);
      },
      fail: function (res) {
        console.log('Sorry, 调节LED灯失败...');
      },
      complete: function (res) {

      },
    })
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