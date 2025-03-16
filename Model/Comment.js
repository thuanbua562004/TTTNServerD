const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  comments: [
    {
      _id: {
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toHexString(),
        unique: true,
      },
      content: { type: String, required: true },
      images: { type: String },
      email: { type: String, required: true },
    },
  ],
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
