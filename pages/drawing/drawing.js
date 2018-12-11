// pages/drawing/drawing.js
let ctx;
var SocketTask;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pen: {
      lineWidth: 5,
      color: "#cc0033",
    },
     xStart: 0,
    yStart: 0,
    left: 0,
    top: 0,
    bili: 1,
    canvasWidth: 0,
    canvasHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.windowWidth >= 320 && res.windowWidth < 352){
          that.setData({
            canvasWidth:320,
            canvasHeight:320,
            bili: 1.0
          })
        } else if (res.windowWidth < 384) {
          that.setData({
            canvasWidth: 352,
            canvasHeight: 352,
            bili: 1.1
          })
        } else if (res.windowWidth < 448){
          that.setData({
            canvasWidth: 384,
            canvasHeight: 384,
            bili:1.2
          })
        } else if (res.windowWidth < 512) {
          that.setData({
            canvasWidth: 448,
            canvasHeight: 448,
            bili: 1.4
          })
        }
        else if (res.windowWidth < 576) {
          that.setData({
            canvasWidth: 512,
            canvasHeight: 512,
            bili: 1.6
          })
        }
        else if (res.windowWidth < 896) {
          that.setData({
            canvasWidth: 576,
            canvasHeight: 576,
            bili: 1.8
          })
        }
        else{
          that.setData({
            canvasWidth: 896,
            canvasHeight: 896,
            bili: 2.8
          })
        }
      },
    })
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
    var that = this
    ctx = wx.createCanvasContext('myCanvas');
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth *  that.data.bili);
    ctx.setLineCap('round');
    ctx.setLineJoin('round');


    const socketOpen = false
    const socketMsgQueue = []
    //建立连接
    SocketTask = wx.connectSocket({
      url: "wss://wgcxinzhan.cn/socket/",
    })
    //连接成功
    wx.onSocketOpen(function () {
      console.log("建立socket连接")
      wx.sendSocketMessage({
        // data: '振涛',
      })
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
    //接收数据
    wx.onSocketMessage(function (data) {
      // console.log(data.data)
      if (data.data != 'undefined') {
        var jsonStr = JSON.parse(data.data);
        if (jsonStr.kind == 'start-draw'){
          
          that.setData({
            xStart: jsonStr.x1,
            yStart: jsonStr.y1,
            'pen.lineWidth': jsonStr.wid
          })
          ctx.setStrokeStyle(that.data.pen.color);
          ctx.setLineWidth(that.data.pen.lineWidth * that.data.bili);
          console.log(that.data.pen.lineWidth * that.data.bili)
          ctx.setLineCap('round');
          ctx.setLineJoin('round');
          
        }
        if (jsonStr.kind == 'draw') {
          var x = that.data.xStart*that.data.bili
          var y = that.data.yStart * that.data.bili
          var x1 = jsonStr.x1 
          var y1 = jsonStr.y1 
          that.onlineMove(x, y,x1,y1)
        }
        if (jsonStr.kind == 'clear') {
          ctx.draw(false)
          ctx.setStrokeStyle(that.data.pen.color);
          ctx.setLineWidth(that.data.pen.lineWidth*that.data.bili);
          ctx.setLineCap('round');
          ctx.setLineJoin('round');
        }
      }
    })
  },
  onlineMove(x, y, x1, y1) {
    var that = this
    console.log("startx:" + x + "starty:" + y + "endx:" + x1 + "endy:" + y1)
    ctx.moveTo(x, y)
    ctx.lineTo(x1 * that.data.bili, y1 * that.data.bili)
    ctx.stroke();
    ctx.draw(true);
    ctx.moveTo(x1 * that.data.bili, y1 * that.data.bili)
    this.setData({
      xStart: x1,
      yStart: y1
    })
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
  touchstart(e) {
    var that = this
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth * this.data.bili);
    ctx.moveTo(e.touches[0].x, e.touches[0].y);
    var x = e.touches[0].x
    var y = e.touches[0].y
    //连接成功
    SocketTask.send({
      data: JSON.stringify({
        x1: x / that.data.bili,
        y1: y / that.data.bili,
        wid: that.data.pen.lineWidth / that.data.bili,
        kind:'start-draw'
      })
    }, function (res) {
      console.log('已发送', res)
    })
  },
  touchend(e){
    ctx.moveTo(this.data.xStart, this.data.yStart)
  },
  touchmove(e) {
    var that = this
    let x = e.touches[0].x;
    let y = e.touches[0].y;
    ctx.lineTo(x, y)
    ctx.stroke();
    ctx.draw(true);
    ctx.moveTo(x, y)
    //连接成功
    SocketTask.send({
      data: JSON.stringify({
        x1: x / that.data.bili,
        y1: y / that.data.bili,
        kind: 'draw'
      })
    }, function (res) {
      console.log('已发送', res)
    })
  },
  penselect(e) {
    this.setData({ 'pen.lineWidth': e.target.dataset.param })
  },
  colorselect(e) {
    this.setData({ 'pen.color': e.target.dataset.param })
  },
  clear(e) {
    ctx.draw(false)
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth * this.data.bili);
    ctx.setLineCap('round');
    ctx.setLineJoin('round');
    //连接成功
    SocketTask.send({
      data: JSON.stringify({
        kind: 'clear'
      })
    }, function (res) {
      console.log('已发送', res)
    })
  },
  
})