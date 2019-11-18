// miniprogram/pages/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[],
     pageNo:0,
     pageSize:10

  },

  formSubmit: function (options) {
    var that = this;
    var index = options.currentTarget.dataset['comIndex'];
    wx.navigateTo({
      url: '../../pages/home/home?id=' + that.data.list[index]._id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    db.collection('videos')
      .orderBy('create_time', 'desc')
      .skip(that.data.pageNo)
      .limit(that.data.pageSize)
    .get({
        success: function (res) {
          that.setData({
            list: res.data,
            pageNo: that.data.pageNo + 1
          })
        }
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
    console.log(123)
    var that = this;
    db.collection('videos')
      .skip(that.data.pageNo * that.data.pageSize)
      .limit(that.data.pageSize)
      .get({
        success: function (res) {
          that.setData({
            list: res.data.concat(that.data.list),
            pageNo: that.data.pageNo + 1
          })
        },
        fail: function(res) {
          console.log(res)
        }
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})