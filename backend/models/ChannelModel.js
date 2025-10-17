import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Messages" },
    ],
  },
  { timestamps: true }
);

// Optional: prevent duplicate channel names for same members
// channelSchema.index({ name: 1, members: 1 }, { unique: true });

const Channel = mongoose.models.Channel || mongoose.model("Channel", channelSchema);
export default Channel;
