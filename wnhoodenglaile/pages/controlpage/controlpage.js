
//获取应用实例
var app = getApp()
var Util = require('../../utils/util.js');

var xStart;
var yStart;
var distance;
var plateAngle; 
var timeoutEvent;
var timeoutSecond;
var currentShowTime;
var isStartConsole;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNotControl:true,
    animation: '',
    screenHeight: 0,
    screenWidth: 0,
    startColor : 0x08ff00,
    startRedColor : 11,
    ctlTimeStr: "剩余 8:25"
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
    // 关灯
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
    this.timeoutEvent = setTimeout(function(){},1);
    this.timeoutSecond = 0;
    this.currentShowTime = 0;
    this.isStartConsole = false;

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

    this.currentShowTime = parseInt(app.globalData.lastCtlTime);
    // console.log('------------------currentShowTime : ' + this.currentShowTime);
    // console.log('------------------lastCtlTime : ' + app.globalData.lastCtlTime);
    var that = this;
    that.countTimeFN();

    this.connectUser(app.globalData.token, app.globalData.productCode, app.globalData.gatewayID);
  },

  countTimeFN:function(){
    this.currentShowTime -= 1;
    if (this.currentShowTime <= 0){
      // 控制时间到了！！！！
      this.currentShowTime = 0;
    }
    var showTimeMin = parseInt(this.currentShowTime / 60);
    var showTimeSec = parseInt(this.currentShowTime) - showTimeMin * 60;
    var showTimeStr = "剩余 " + showTimeMin;
    if (showTimeSec == 0) {
      showTimeStr += ":00";
    } else {
      showTimeStr += ":" + showTimeSec;
    }

    // 是否开启调试信息，默认为false
    if (this.isStartConsole){
      console.log("当前剩余时间 : " + this.currentShowTime);
    }
    
    this.setData({
      ctlTimeStr:showTimeStr,
    })

    this.timeoutEvent = setTimeout(function(){
      this.countTimeFN();
    }.bind(this), 1000)
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
    this.timeoutSecond = Date.parse(new Date());
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

    var mPlateAngle = (this.distance * 360 / 150); // 转盘灵敏度控制
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

    // 旋转动画设置
    // console.log('当前角度 :' + this.plateAngle);
    this.animation.rotate(this.plateAngle).step();
    this.setData({
      //输出动画
      animation: this.animation.export()
    })

    //console.log("当前角度 : " + this.plateAngle);

    // 根据this.plateAngle角度进行调色
    this.ajust_color_with_angle();
  },

  touchEndFN:function(){
    // 根据this.plateAngle角度进行调色
    this.ajust_color_with_angle();
  },

  ajust_color_with_angle:function(){
    // 调色 -- 200ms间隔调色，速度不能太快，否则服务器响应不过来，最好在200~300ms内
    var currentSecond = Date.parse(new Date());
    if ((currentSecond - this.timeoutSecond) > 20) { // 200是间隔时间，可以调整
      this.timeoutSecond = currentSecond;
      // 颜色设置
      var redColor = 0;
      var greenColor = 0;
      var blueColor = 0;
      if ((this.plateAngle >= 303) || (this.plateAngle < 3)) {
        // 绿黄区间 -- redColor增加or减少 greenColor固定为255 blueColor固定为0
        if (this.plateAngle >= 303) {
          // 330~360 : redColor增加
          var tempValue = 0;
          tempValue = 360 - this.plateAngle;
          // 4.25 表示为 颜色区间255/区间角度60度 的比值
          redColor = parseInt(this.data.startRedColor + tempValue * 4.25);
        } else {
          redColor = parseInt(this.data.startRedColor - this.plateAngle * 4.25);
        }
        greenColor = 255;
        blueColor = 0;
      } else if ((this.plateAngle >= 3) && (this.plateAngle < 63)) {
        // 绿青区间 -- redColor为0 greenColor为255 blueColor为增量
        var tempValue = 0;
        tempValue = this.plateAngle - 30;
        redColor = 0;
        greenColor = 255;
        blueColor = parseInt(tempValue * 4.25);
      } else if ((this.plateAngle >= 63) && (this.plateAngle < 123)) {
        // 青蓝区间 -- redColor为0 greenColor为减量 blueColor为255
        var tempValue = 0;
        tempValue = this.plateAngle - 90;
        redColor = 0;
        greenColor = 255 - parseInt(tempValue * 4.25);
        blueColor = 255;
      } else if ((this.plateAngle >= 123) && (this.plateAngle < 183)) {
        // 蓝粉区间 -- redColor为增量 greenColor为0 blueColor为255
        var tempValue = 0;
        tempValue = this.plateAngle - 150;
        redColor = parseInt(tempValue * 4.25);
        greenColor = 0;
        blueColor = 255;
      } else if ((this.plateAngle >= 183) && (this.plateAngle < 243)) {
        // 粉红区间 -- redColor为255 greenColor为0 blueColor为减量
        var tempValue = 0;
        tempValue = this.plateAngle - 210;
        redColor = 255;
        greenColor = 0;
        blueColor = 255 - parseInt(tempValue * 4.25);
      } else {
        // 红黄区间 -- redColor为255 greenColor为增量 blueColor为0
        var tempValue = 0;
        tempValue = this.plateAngle - 270;
        redColor = 255;
        greenColor = parseInt(tempValue * 4.25);
        blueColor = 0;
      }
      // 滤波设置，防止颜色超出范围
      if (redColor>=255){
        redColor = 255;
      }else if (redColor <= 0){
        redColor = 0;
      }
      if (greenColor >= 255) {
        greenColor = 255;
      } else if (greenColor <= 0) {
        greenColor = 0;
      }
      if (blueColor >= 255) {
        blueColor = 255;
      } else if (blueColor <= 0) {
        blueColor = 0;
      }
      //发送调色指令
      this.data.startColor = (redColor << 16) + (greenColor << 8) + blueColor;
      console.log('当前角度 : ' + this.plateAngle);
      console.log('red :' + redColor + ', green : ' + greenColor + ', blue : ' + blueColor);
      console.log('当前颜色 : ' + this.data.startColor.toString(16));
      // 判断红色的值是否异常，必须要补足6位数
      var color27;
      if(redColor == 0){
        if(greenColor == 0){
          color27 = "0000" + this.data.startColor.toString(16);
        } else if (greenColor < 16) {
          color27 = "000" + this.data.startColor.toString(16);
        } else {
          color27 = "00" + this.data.startColor.toString(16);
        }
      } else if (redColor < 16){
        color27 = "0" + this.data.startColor.toString(16);
      } else {
        color27 = this.data.startColor.toString(16);
      }
      this.slider_ctl_color(app.globalData.token, app.globalData.gatewayID, app.globalData.deviceID, color27);
    }
  },

  /**
   * 发送调节颜色的指令
   */
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

  romanticScene:function(){
    // 情景模式 -- 02红粉浪漫
    this.scene_ajust_color(app.globalData.token, app.globalData.gatewayID, app.globalData.deviceID, "020000");
  },

  partyScene:function(){
    // 情景模式 -- 06炫彩呼吸
    this.scene_ajust_color(app.globalData.token, app.globalData.gatewayID, app.globalData.deviceID, "060000");
  },

  fadeScene:function(){
    // 情景模式 -- 01炫彩渐变
    this.scene_ajust_color(app.globalData.token, app.globalData.gatewayID, app.globalData.deviceID, "010000");
  },

  forestScene:function(){
    // 情景模式 -- 05萤火之森
    this.scene_ajust_color(app.globalData.token, app.globalData.gatewayID, app.globalData.deviceID, "050000");
  },

  /**
   * 情景模式
   */
  scene_ajust_color: function (mtoken, gatewayID, deviceID, color) {
    //console.log(res.detail.value);

    var ts = Date.parse(new Date());
    ts = ts / 1000;

    var controlStr = '';
    controlStr += deviceID;
    controlStr += ";21";
    controlStr += color;
    controlStr += "0000";

    wx.request({
      url: 'https://api.wnhoo.com/smart/sensors/send_push',
      header: {
        "Content-Type": "x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({ token: mtoken, device_id: gatewayID, sensor_id: 'S62', sensor_type: 1, timestamp: ts, data: controlStr }),
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
    var that = this;
    clearTimeout(that.timeoutEvent);
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