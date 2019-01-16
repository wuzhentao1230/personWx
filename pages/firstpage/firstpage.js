// pages/firstpage/firstpage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAuth: false,
    person: {
      leftimg: '../../images/snn.jpg',
      rightimg: '../../images/nanmei.jpg'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    setTimeout(function() {
      if (app.globalData.userInfo) {
        that.setData({
          hasAuth: true
        })
      }
    }, 1000)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onGotUserInfo(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        hasAuth: true,
      })
    }
  },
  jumpDailyShow: function() {
    // wx.redirectTo({
    //   url: '/pages/dailyshow/dailyshow'
    // })
    wx.navigateTo({
      url: '/pages/dailyshow/dailyshow'
    })
  }
})