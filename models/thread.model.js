const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const childSchema = new Schema({
  text: String,
  delete_password: String,
  thread_id: String,
  reported: Boolean
}, { timestamps: true });

const threadSchema = new Schema({
  text: String,
  password: String,
  board: String,
  reported: Boolean,
  replies: [ childSchema ],
  replycount: Number
}, { timestamps: true });

const Child = mongoose.model('Child', childSchema);
const Thread = mongoose.model('Thread', threadSchema);

exports.childModel = Child;
exports.threadModel = Thread;
