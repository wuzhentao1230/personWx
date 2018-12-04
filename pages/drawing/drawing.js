// pages/drawing/drawing.js
let ctx;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pen: {
      lineWidth: 50,
      color: "#cc0033"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ctx = wx.createCanvasContext('myCanvas');
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth);
    ctx.setLineCap('round');
    ctx.setLineJoin('round');


    const socketOpen = false
    const socketMsgQueue = []
    //建立连接
    wx.connectSocket({
      url: "ws://localhost:8080",
    })
    //连接成功
    wx.onSocketOpen(function () {
      wx.sendSocketMessage({
        data: '振涛',
      })
    })
    //接收数据
    wx.onSocketMessage(function (data) {
      // var objData = JSON.parse(data.data);
      console.log(data)
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
    console.log("content start: x=" + e.touches[0].x + ",y=" + e.touches[0].y + " color:" + this.data.pen.color + " lenth:" + this.data.pen.lineWidth)
  },
  touchmove(e) {
    let x = e.touches[0].x;
    let y = e.touches[0].y;
    ctx.lineTo(x, y)
    ctx.stroke();
    ctx.draw(true);
    ctx.moveTo(x, y)
    console.log("content start: x=" + x + ",y=" + y + " color:" + this.data.pen.color + " lenth:" + this.data.pen.lineWidth)
  },
  penselect(e) {
    this.setData({ 'pen.lineWidth': e.target.dataset.param })
  },
  colorselect(e) {
    this.setData({ 'pen.color': e.target.dataset.param })
  }
})