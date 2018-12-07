// pages/drawing/drawing.js
let ctx;
var SocketTask;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pen: {
      lineWidth: 50,
      color: "#cc0033",
      xStart:0+100,
      yStart: 0 + 100,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    ctx = wx.createCanvasContext('myCanvas');
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth);
    ctx.setLineCap('round');
    ctx.setLineJoin('round');


    const socketOpen = false
    const socketMsgQueue = []
    //建立连接
    SocketTask = wx.connectSocket({
      url: "ws://30.25.29.7:8080",
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
      if (data.data != 'undefined'){
        var jsonStr=JSON.parse(data.data);
        setTimeout(function(res){
          that.onlineMove(that.data.xStart, that.data.yStart, jsonStr.x1, jsonStr.y1 + 200)
        },2000)
        
        // console.log(jsonStr.x1)
      }
      // onlineMove(this.data.xStart,this.data.yStart,data.x+100,data.y+100)
      // var objData = JSON.parse(data.data);
      
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
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth);
    ctx.moveTo(e.touches[0].x, e.touches[0].y);
    this.setData({
      xStart: e.touches[0].x,
      yStart: e.touches[0].y+200
    })
    console.log("content start: x=" + e.touches[0].x + ",y=" + e.touches[0].y + " color:" + this.data.pen.color + " lenth:" + this.data.pen.lineWidth)
  },
  touchend(e){
    ctx.moveTo(this.data.xStart, this.data.yStart)
  },
  touchmove(e) {
    let x = e.touches[0].x;
    let y = e.touches[0].y;
    ctx.lineTo(x, y)
    ctx.stroke();
    ctx.draw(true);
    ctx.moveTo(x, y)
    //连接成功
    SocketTask.send({
      data: JSON.stringify({
        x1: x,
        y1:y
      })
    }, function (res) {
      console.log('已发送', res)
    })

    // console.log("content start: x=" + x + ",y=" + y + " color:" + this.data.pen.color + " lenth:" + this.data.pen.lineWidth)
  },
  penselect(e) {
    this.setData({ 'pen.lineWidth': e.target.dataset.param })
  },
  colorselect(e) {
    this.setData({ 'pen.color': e.target.dataset.param })
  },
   onlineMove(x,y,x1,y1) {
     console.log("startx:" + x + "starty:" + y + "endx:" + x1 + "endy:" + y1 )
     ctx.lineTo(x, y)
     ctx.stroke();
     ctx.draw(true);
     ctx.moveTo(x, y)
     this.setData({
       xStart: x1,
       yStart: y1
     })
    // console.log("content start: x=" + x + ",y=" + y + " color:" + this.data.pen.color + " lenth:" + this.data.pen.lineWidth)
  },
})