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
    commentContent: '',
    isAuth: false,
    userId: null,
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
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            isAuth: true
          });
          wx.cloud.callFunction({
            name: 'login',
            data: {
              weRunData: wx.cloud.CloudID(res.cloudID), // 这个 CloudID 值到云函数端会被替换
              obj: {
                shareInfo: wx.cloud.CloudID('yyy'), // 非顶层字段的 CloudID 不会被替换，会原样字符串展示
              }
            },
            success: function(res) {
              const userId = res.result.userInfo.openId;
              that.setData({
                userId: userId
              });
            },
            fail: console.error
          })
        }
      }
    })
  },
  bindGetUserInfo(res) {
    var that = this;
    if (res.detail.userInfo) {
      that.setData({
        isAuth: true
      });
    } else {
      wx.showToast({
        title: "授权后才能评论哦"
      });
    }
  },
  submitForm(e) {
    var that = this;
    // 必须是在用户已经授权的情况下调用
    wx.getUserInfo({
      success: function(res) {
        console.log(res);
        userInfo = res.userInfo
        var form = e.detail.value;
        if (form.comment == "") {
          // util.showLog('请输入评论'); TODOMM  弹框模块
          wx.showToast({
            title: "请输入评论"
          })
          return;
        }
        var userId;
        wx.cloud.callFunction({
          name: 'login',
          data: {
            weRunData: wx.cloud.CloudID(res.cloudID), // 这个 CloudID 值到云函数端会被替换
            obj: {
              shareInfo: wx.cloud.CloudID('yyy'), // 非顶层字段的 CloudID 不会被替换，会原样字符串展示
            }
          },
          success: function(res) {
            console.log(res);
            userId = res.result.weRunData.data.openId;
            // 提交评论
            db.collection('fish_comment').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                // "_id": "abc25dd1-7977-431b-99f2-07007f1c2fe1",
                video_id: id,
                user_id: userId,
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
          },
          fail: console.error
        })
      }
    })
  },
  deleteComment(e) {
    var that = this;
    const commentId = e.target.dataset.commentid;
    wx.cloud.callFunction({
      name: 'dbDelete',
      data: {
        _id: commentId,
        collection: 'fish_comment'
      },
      success: function(res) {
        console.log(res);
        wx.showToast({
          title: "删除评论成功"
        });
        that.refreshComment();
      },
      fail: console.error
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
            list: res.data,
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