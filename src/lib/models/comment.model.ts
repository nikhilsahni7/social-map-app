import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  postId: { type: String, required: true },
  parentId: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);