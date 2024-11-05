import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      enum: ["Human", "Plant", "Animal"],
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
        required: true,
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
        quantity: Number,
        byWhen: Date,
        dropLocation: String,
      },
    ],
    otherSupport: String,
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ location: "2dsphere" });

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
