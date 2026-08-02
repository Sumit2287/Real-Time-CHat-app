import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { aiService } from "../ai/services/ai.service.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const senderSocketId = getReceiverSocketId(senderId);
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // 1. Asynchronously index message for semantic vector search
    aiService.indexMessage(newMessage).catch((err) => {
      console.error("[sendMessage] Async vector indexing error:", err.message);
    });

    // 2. Check if message contains @AI trigger
    if (text && text.includes("@AI")) {
      const socket = senderSocketId ? io.to(senderSocketId) : null;
      const receiverSocket = receiverSocketId ? io.to(receiverSocketId) : null;

      // Handle AI Assistant workflow in background
      (async () => {
        try {
          const aiResponseText = await aiService.handleAiAssistantQuery({
            userQuery: text,
            userName: req.user.fullName,
            currentUserId: senderId,
            targetUserId: receiverId,
            socket,
            receiverSocket,
          });

          // Save AI response as a message from receiver or system AI assistant
          if (aiResponseText) {
            const aiMessage = new Message({
              senderId: receiverId, // Attributed to AI recipient or system bot
              receiverId: senderId,
              text: `🤖 AI Assistant: ${aiResponseText}`,
            });
            await aiMessage.save();
            
            // Notify clients of the completed AI message
            if (senderSocketId) io.to(senderSocketId).emit("newMessage", aiMessage);
            if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", aiMessage);

            // Index the AI message too
            aiService.indexMessage(aiMessage).catch(() => {});
          }
        } catch (err) {
          console.error("[sendMessage] AI Assistant execution failed:", err.message);
        }
      })();
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
