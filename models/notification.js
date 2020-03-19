

const mongoose = require('mongoose');
const NotificationSchema = mongoose.Schema({
  postId:String,
  body: String,
  read:Boolean
});
module.exports = mongoose.model('Notification',NotificationSchema);