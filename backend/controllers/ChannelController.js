import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

// -------------------- CREATE CHANNEL --------------------
export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.user.userId;

    if (!name || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Name and members are required." });
    }

    const admin = await User.findById(userId);
    if (!admin) return res.status(400).send("Admin user not found.");

    // Include admin in members list without duplicates
    const allMembers = [...new Set([...members, userId])];

    // Validate all member IDs exist
    const validMembers = await User.find({ _id: { $in: allMembers } });
    if (validMembers.length !== allMembers.length) {
      return res.status(400).json({ message: "Some members are invalid users." });
    }

    const newChannel = new Channel({
      name,
      members: allMembers,
      admin: userId,
    });

    const savedChannel = await newChannel.save();

    const populated = await savedChannel
      .populate("members", "firstName lastName email image color")
      .populate("admin", "firstName lastName email image color");

    res.status(201).json({ channel: populated });
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).send("Internal server error");
  }
};

// -------------------- GET USER CHANNELS --------------------
export const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    })
      .populate("members", "firstName lastName email image color")
      .populate("admin", "firstName lastName email image color")
      .sort({ updatedAt: -1 });

    res.status(200).json({ channels });
  } catch (error) {
    console.error("Error fetching channels:", error);
    res.status(500).send("Internal server error");
  }
};

// -------------------- ADD MEMBERS TO CHANNEL --------------------
export const addMembersToChannel = async (req, res) => {
  try {
    const { channelId, newMembers } = req.body;

    if (!Array.isArray(newMembers) || newMembers.length === 0)
      return res.status(400).json({ message: "New members are required" });

    // Validate new members
    const validMembers = await User.find({ _id: { $in: newMembers } });
    if (validMembers.length !== newMembers.length)
      return res.status(400).json({ message: "Some members are invalid" });

    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      { $addToSet: { members: { $each: newMembers } } },
      { new: true }
    )
      .populate("members", "firstName lastName email image color")
      .populate("admin", "firstName lastName email image color");

    if (!updatedChannel) return res.status(404).json({ message: "Channel not found" });

    res.status(200).json({ channel: updatedChannel });
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- REMOVE MEMBERS FROM CHANNEL --------------------
export const removeMembersFromChannel = async (req, res) => {
  try {
    const { channelId, removeMembers } = req.body;

    if (!Array.isArray(removeMembers) || removeMembers.length === 0)
      return res.status(400).json({ message: "Members to remove are required" });

    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      { $pull: { members: { $in: removeMembers } } },
      { new: true }
    )
      .populate("members", "firstName lastName email image color")
      .populate("admin", "firstName lastName email image color");

    if (!updatedChannel) return res.status(404).json({ message: "Channel not found" });

    res.status(200).json({ channel: updatedChannel });
  } catch (error) {
    console.error("Error removing members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- DELETE CHANNEL --------------------
export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const deletedChannel = await Channel.findByIdAndDelete(channelId);

    if (!deletedChannel) return res.status(404).json({ message: "Channel not found" });

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    console.error("Error deleting channel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
