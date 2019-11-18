// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'weixin-canyin-8df4fc'
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection(event.collection).where({
      _id: event._id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}