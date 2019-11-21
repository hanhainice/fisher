// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('videos').add({
    data: {
      avatar: event.avatar,
      coverImg: event.coverImg,
      create_time: new Date(),
      name: event.name,
      resource_add: event.resource_add,
      title: event.title
    },
    success: function (res) {
      console.log(res)
    },
    fail: console.error
  })
}