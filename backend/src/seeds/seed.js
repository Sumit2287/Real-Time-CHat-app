import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { aiService } from "../ai/services/ai.service.js";

config();

const seedUsers = [
  {
    email: "emma.thompson@example.com",
    fullName: "Emma Thompson",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  },
  {
    email: "james.anderson@example.com",
    fullName: "James Anderson",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
  {
    email: "sarah.chen@example.com",
    fullName: "Sarah Chen",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
  },
  {
    email: "alex.rivera@example.com",
    fullName: "Alex Rivera",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
  },
  {
    email: "sophia.davis@example.com",
    fullName: "Sophia Davis",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  },
  {
    email: "daniel.kim@example.com",
    fullName: "Daniel Kim",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    // Clear existing users and messages
    const emails = seedUsers.map((u) => u.email);
    await User.deleteMany({ email: { $in: emails } });
    
    console.log("Creating seed users...");
    const salt = await bcrypt.genSalt(10);
    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, salt),
      }))
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`Created ${createdUsers.length} seed users.`);

    // Map users by email for message creation
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u._id;
    });

    const emmaId = userMap["emma.thompson@example.com"];
    const jamesId = userMap["james.anderson@example.com"];
    const sarahId = userMap["sarah.chen@example.com"];
    const alexId = userMap["alex.rivera@example.com"];

    // Seed realistic conversation threads
    const messagesToSeed = [
      // Thread 1: Emma & James (Technical discussion on JWT, Docker & Deployment)
      {
        senderId: jamesId,
        receiverId: emmaId,
        text: "Hey Emma! Have you finished configuring the JWT token authentication for our API endpoints?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
      {
        senderId: emmaId,
        receiverId: jamesId,
        text: "Yes James! JWT tokens are signed using HS256 algorithm and stored securely in HTTP-only cookies with SameSite lax protection.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 5),
      },
      {
        senderId: jamesId,
        receiverId: emmaId,
        text: "Awesome! How about our Docker container deployment script?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 10),
      },
      {
        senderId: emmaId,
        receiverId: jamesId,
        text: "The Dockerfile has multi-stage builds optimized. Node.js backend and React frontend are ready for production on Render.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 15),
      },
      {
        senderId: jamesId,
        receiverId: emmaId,
        text: "@AI summarize our discussion on JWT and Docker deployment",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 2),
      },
      {
        senderId: emmaId,
        receiverId: jamesId,
        text: "🤖 AI Assistant: In this conversation, Emma confirmed JWT authentication is configured with HS256 signing stored in HTTP-only cookies. Docker deployment uses multi-stage builds targeted for Render deployment.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 3),
      },

      // Thread 2: Emma & Sarah (UI Design & Vector Databases)
      {
        senderId: sarahId,
        receiverId: emmaId,
        text: "Hi Emma, I love the new dark mode theme with glassmorphism! The DaisyUI color palettes look super sleek.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
      {
        senderId: emmaId,
        receiverId: sarahId,
        text: "Thanks Sarah! We also added ChromaDB vector database integration with BAAI/bge-small-en-v1.5 embeddings for AI Semantic Search.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
      },
      {
        senderId: sarahId,
        receiverId: emmaId,
        text: "That's incredible! Can we search by semantic meaning instead of plain keywords now?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
      },
      {
        senderId: emmaId,
        receiverId: sarahId,
        text: "Exactly. Try typing 'security tokens' or 'database indexing' in the AI Search modal!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9),
      },

      // Thread 3: James & Alex (State Management & Performance)
      {
        senderId: alexId,
        receiverId: jamesId,
        text: "James, are we using Redux Toolkit or Zustand for global state management?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
      {
        senderId: jamesId,
        receiverId: alexId,
        text: "We chose Zustand! It provides a lightweight API with zero boilerplate and handles Socket.IO event subscriptions cleanly.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      },
      {
        senderId: alexId,
        receiverId: jamesId,
        text: "Can we schedule a quick code review call tomorrow at 3 PM?",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        senderId: jamesId,
        receiverId: alexId,
        text: "Sure! I'll put it on our calendar.",
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
      },
    ];

    // Remove existing seed messages
    await Message.deleteMany({
      $or: [
        { senderId: { $in: Object.values(userMap) } },
        { receiverId: { $in: Object.values(userMap) } },
      ],
    });

    console.log("Inserting seed messages...");
    const createdMessages = await Message.insertMany(messagesToSeed);
    console.log(`Inserted ${createdMessages.length} seed messages.`);

    // Automatically index messages into ChromaDB vector store
    console.log("Indexing seed messages into ChromaDB vector database...");
    for (const msg of createdMessages) {
      await aiService.indexMessage(msg);
    }

    console.log("Database & Vector Store seeded successfully!");
    console.log("Demo logins:");
    console.log("1. Emma Thompson -> emma.thompson@example.com / 123456");
    console.log("2. James Anderson -> james.anderson@example.com / 123456");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
