import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import {
  createChannel,
  getUserChannels,
  addMembersToChannel,
  removeMembersFromChannel,
  deleteChannel
} from "../controllers/ChannelController.js";

const channelRoutes = Router();

// -------------------- CHANNEL ROUTES --------------------

// Create a new channel
channelRoutes.post("/create-channel", verifyToken, createChannel);

// Get all channels for the logged-in user
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);

// Add members to an existing channel
channelRoutes.put("/add-members", verifyToken, addMembersToChannel);

// Remove members from a channel
channelRoutes.put("/remove-members", verifyToken, removeMembersFromChannel);

// Delete a channel
channelRoutes.delete("/delete-channel/:channelId", verifyToken, deleteChannel);

export default channelRoutes;
