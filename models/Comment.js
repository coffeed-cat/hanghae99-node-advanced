const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
  articleId: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

commentSchema.virtual("commentId").get(function () {
  return this._id.toHexString();
});

commentSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("comment", commentSchema);
