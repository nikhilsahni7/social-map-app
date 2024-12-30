import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    objective: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      enum: ["👨 Human", "🌳 Plant", "🐕 Animal"],
      required: true,
    },
    duration: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
      address: String,
    },
    pictureOfSuccess: {
      url: String,
      publicId: String,
    },
    supportItems: [
      {
        item: String,
        quantity: String,
        byWhen: String,
        dropLocation: String,
        supportProvided: { type: Number, default: 0 }
      },
    ],
    otherSupport: String,
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    likeCount: {
      type: Number,
      default: 0
    },
    isLiked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ location: "2dsphere" });
export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
