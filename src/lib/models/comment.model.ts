import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  postId: {
    type: String,
    required: [true, 'Post ID is required'],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  likes: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

export const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);