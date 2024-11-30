// models/connection.ts
import mongoose from "mongoose";

interface IConnection extends mongoose.Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: string;
}

const connectionSchema = new mongoose.Schema<IConnection>(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.models.Connection ||
  mongoose.model<IConnection>("Connection", connectionSchema);
