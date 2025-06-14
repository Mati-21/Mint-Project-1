import ChatMessage from "../models/ChatMessage.js";
import Group from "../models/Group.js";
import { io, onlineUsers } from "../server.js";
import path from "path";
import mongoose from "mongoose";

// Send message to user (supports both JSON and multipart/form-data)
export const sendMessageToUser = async (req, res) => {
  try {
    const { text, fileUrl, fileName } = req.body;
    const userId = req.userId;
    const otherId = req.params.userId;

    const msg = await ChatMessage.create({
      from: userId,
      to: otherId,
      text,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      delivered: false,
      seen: false,
    });
    res.json({ ...msg.toObject(), isMe: true });
  } catch (err) {
    console.error("sendMessageToUser error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get messages with user
export const getMessagesWithUser = async (req, res) => {
  const userId = req.userId;
  const otherId = req.params.userId;
  const messages = await ChatMessage.find({
    $or: [
      { from: userId, to: otherId },
      { from: otherId, to: userId },
    ],
  }).sort({ createdAt: 1 }).lean();

  // Mark delivered
  await ChatMessage.updateMany(
    { from: otherId, to: userId, delivered: false },
    { $set: { delivered: true } }
  );

  res.json(messages.map(m => ({
    ...m,
    isMe: m.from.toString() === userId,
  })));
};

// Mark as seen
export const markSeen = async (req, res) => {
  const userId = req.userId;
  const otherId = req.params.userId;
  await ChatMessage.updateMany(
    { from: otherId, to: userId, seen: false },
    { $set: { seen: true } }
  );
  res.json({ success: true });
};

// Unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await ChatMessage.countDocuments({ to: userId, seen: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
};

// Unread count per user
export const getUnreadCountPerUser = async (req, res) => {
  const userId = req.userId;
  // Group by sender, count unseen messages sent to this user
  const result = await ChatMessage.aggregate([
    { $match: { to: userId, seen: false } },
    { $group: { _id: "$from", count: { $sum: 1 } } }
  ]);
  // Convert to { userId: count }
  const counts = {};
  result.forEach(r => { counts[r._id.toString()] = r.count; });
  res.json(counts);
};

// Recent chats
export const getRecentChats = async (req, res) => {
  const userId = req.userId;
  const messages = await ChatMessage.find({ $or: [{ from: userId }, { to: userId }] })
    .sort({ updatedAt: -1 })
    .populate("from", "fullName email")
    .populate("to", "fullName email")
    .lean();

  const users = [];
  const seen = new Set();

  messages.forEach(m => {
    // Defensive: skip if from or to is missing
    if (!m.from || !m.to || !m.from._id || !m.to._id) return;
    const other = m.from._id.toString() === userId ? m.to : m.from;
    if (!other || !other._id) return;
    if (!seen.has(other._id.toString())) {
      users.push(other);
      seen.add(other._id.toString());
    }
  });

  res.json(users);
};

// Group chat endpoints (simplified)
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name || !members || !members.length) {
      return res.status(400).json({ error: "Name and members are required" });
    }
    const group = await Group.create({ name, members });
    res.status(201).json(group);
  } catch (err) {
    console.error("createGroup error:", err);
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Fetch all groups for a user
export const getGroupsForUser = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("userId from token:", userId, typeof userId);

    // Always use ObjectId for the query
    const objectId = new mongoose.Types.ObjectId(userId);
    console.log("objectId type:", typeof objectId, objectId instanceof mongoose.Types.ObjectId);

    const groups = await Group.find({
      members: objectId
    });

    console.log("Fetched groups for user:", groups);
    res.json(groups);
  } catch (err) {
    console.error("getGroupsForUser error:", err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// Send message to group (supports both JSON and multipart/form-data)
export const sendGroupMessage = async (req, res) => {
  try {
    let text = req.body.text;
    let fileUrl = null, fileName = null;

    if (req.file) {
      fileName = req.file.originalname;
      fileUrl = `/uploads/${req.file.filename}`;
    }

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const userId = req.userId;
    const groupId = req.params.groupId;
    const msg = await ChatMessage.create({
      from: userId,
      group: groupId,
      text,
      fileUrl,
      fileName,
      delivered: false,
      seen: false,
    });
    res.json({ ...msg.toObject(), isMe: true });
  } catch (err) {
    console.error("sendGroupMessage error:", err);
    res.status(500).json({ error: "Failed to send group message" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.userId;
    const messages = await ChatMessage.find({ group: groupId })
      .sort({ createdAt: 1 })
      .populate("from", "fullName email")
      .lean();
    res.json(messages.map(m => ({
      ...m,
      isMe: m.from._id.toString() === userId,
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch group messages" });
  }
};

// File upload for chat
export const uploadChatFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Create a chat message for the file
    const msg = await ChatMessage.create({
      from: req.userId,
      to: req.body.to, // or group: req.body.group if group chat
      text: null,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      delivered: false,
      seen: false,
    });
    res.json({ ...msg.toObject(), isMe: true });
  } catch (err) {
    console.error("uploadChatFile error:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

export const uploadGroupChatFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { groupId } = req.body;
    if (!groupId) {
      return res.status(400).json({ error: "No groupId provided" });
    }
    const msg = await ChatMessage.create({
      from: req.userId,
      group: groupId,
      text: null,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      delivered: false,
      seen: false,
    });
    res.json({ ...msg.toObject(), isMe: true });
  } catch (err) {
    console.error("uploadGroupChatFile error:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};