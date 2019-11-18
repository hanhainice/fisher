// pages/update/update.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl:"",
    coverImg:"",
    title:""
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
   *  页面相关事件处 理函数--监听用户下拉动作
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

  /**
   * 上传视频
   */
  chooseVideo: function () {
    let that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(res)
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: tempFilePath.split('.')[2] + "." + res.tempFilePath.split('.')[3],
          // 指定要上传的文件的小程序临时文件路径
          filePath: tempFilePath,
          // 成功回 调
            success: res => {
              that.setData({
                videoUrl: tempFilePath,
              })
              console.log('上传成功', res)
          },
        })
      }
    })
  },

  chooseImg:function() {
    let that = this
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0];
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: tempFilePath.split('.')[2] + "." + tempFilePath.split('.')[3],
          // 指定要上传的文件的小程序临时文件路径
          filePath: tempFilePath,
          // 成功回调
          success: res => {
            that.setData({
              imgUrl: tempFilePath,
            })
            console.log('上传成功', res)
          },
          fail:res => {
            console.log('上传失败', res)
          }
        })
      }
    })
  },

  publish: function() {
    var that = this;
    wx.getUserInfo({
      success: res => {
        wx.cloud.callFunction({
          name: 'video_add',
          data: {
            avatar: res.userInfo.avatarUrl,
            coverImg: that.data.coverImg,
            name: res.userInfo.nickName,
            resource_add: that.data.videoUrl,
            title: that.data.title
          },
          success: res => {
            wx.showToast({
              title: '已发布，待审核',
              icon: 'success',
              duration: 3000
            })
          },
          fail: err => {
            console.error('[云函数] [video_add] 调用失败', err)
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '请授权后发布',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})