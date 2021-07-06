const mongoose = require("mongoose");

const { Schema } = mongoose;

const articleSchema = new Schema({
  date: {
    type: Number,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  lastFixDate: {
    type: Number,
  },
});

articleSchema.virtual("articleId").get(function () {
  return this._id.toHexString();
});

articleSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Article", articleSchema);
