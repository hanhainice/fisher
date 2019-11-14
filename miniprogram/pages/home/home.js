// miniprogram/pages/home.js
const db = wx.cloud.database();
var userInfo;
var id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vedio: {},
    list: [],
    commentContent:''
  },

  onPlay: function(options) {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    id = options.id;
    db.collection('videos')
      .where({
        _id: id
      })
      .get({
        success: function(res) {
          that.setData({
            vedio: res.data[0],
          })
        },
        fail: function(res) {
          console.log(res)
        }
      });
    this.refreshComment();
  },
  submitForm(e) {
    var that = this;
    // 必须是在用户已经授权的情况下调用
    wx.getUserInfo({ //TODMOMM 授权
      success: function(res) {
        userInfo = res.userInfo
        var form = e.detail.value;
        if (form.comment == "") {
          // util.showLog('请输入评论'); TODOMM  弹框模块
          wx.showToast({
            title: "请输入评论"
          })
          return;
        }
        // 提交评论
        db.collection('fish_comment').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // "_id": "abc25dd1-7977-431b-99f2-07007f1c2fe1",
            video_id: id,
            user_id: "mm",
            comment: form.comment,
            create_time: new Date(),
            user_name: userInfo.nickName,
            user_photo: userInfo.avatarUrl
          },
          success: function(res) {
            e.detail.value.comment = "";
            that.setData({
              commentContent: ''
            });
            that.refreshComment();
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            wx.showToast({
              title: "发表评论成功"
            });
          },
          fail: console.error
        });
      }
    })
  },
  refreshComment() {
    var that = this;
    db.collection('fish_comment')
      .where({
        video_id: id
      })
      .get({
        success: function(res) {
          that.setData({
            list: res.data, //TODOMM 根据user_id关联查询用户信息；微信UserInfo里没有userid?
          })
        },
        fail: function(res) {
          console.log(res)
        }
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  }
})