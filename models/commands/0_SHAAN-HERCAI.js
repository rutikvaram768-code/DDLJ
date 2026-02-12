const axios = require("axios");

module.exports.config = {
  name: "hercai",
  version: "2.5.0",
  hasPermission: 0,
  credits: "Shaan Khan", 
  description: "Persistent Multi-Script AI - Locked Language Mode",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[Bot ke message par reply karein]",
  cooldowns: 2,
};

let userMemory = {};
let isActive = true;

module.exports.handleEvent = async function ({ api, event }) {
  // Credits Lock
  if (global.client.commands.get("hercai").config.credits !== "Shaan Khan") {
    return api.sendMessage("⚠️ Error: Credits changed. Creator: Shaan Khan", event.threadID, event.messageID);
  }

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body) return;

  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  api.setMessageReaction("⌛", messageID, () => {}, true);
  api.sendTypingIndicator(threadID);

  const userQuery = body.trim();
  if (!userMemory[senderID]) userMemory[senderID] = [];

  const conversationHistory = userMemory[senderID].join("\n");
  
  // **Strict Language Persistence Prompt**
  const systemPrompt = `You are an AI by Shaan Khan.
  RULES:
  1. Default is Roman Urdu.
  2. If the user asks for a specific language/script (Pashto, Urdu script, Hindi script, etc.), you must SWITCH to that script and REMAIN in that script for all future replies.
  3. DO NOT switch back to Roman Urdu unless the user explicitly says "Roman mein baat karo" or "Switch to Roman".
  4. Even if the user continues to chat in Roman Urdu, your responses must stay in the last requested native script.
  Context: ${conversationHistory}`;

  // Using 'search' or 'mistral' for maximum speed
  const apiURL = `https://text.pollinations.ai/${encodeURIComponent(systemPrompt + "\nUser: " + userQuery)}?model=search&seed=${Math.random()}`;

  try {
    const response = await axios.get(apiURL, { timeout: 15000 });
    let botReply = response.data || "Server slow hai, dubara try karein.";

    // Memory for context (6 messages for speed)
    userMemory[senderID].push(`U: ${userQuery}`);
    userMemory[senderID].push(`B: ${botReply}`);
    if (userMemory[senderID].length > 6) userMemory[senderID].splice(0, 2);

    api.setMessageReaction("✅", messageID, () => {}, true);
    return api.sendMessage(botReply, threadID, messageID);

  } catch (error) {
    api.setMessageReaction("❌", messageID, () => {}, true);
    return api.sendMessage("❌ Speed issue! Dubara koshish karein.", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  if (global.client.commands.get("hercai").config.credits !== "Shaan Khan") return;
  const { threadID, messageID } = event;
  const command = args[0]?.toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ AI Active (Shaan Khan). Language lock mode enabled!", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ AI Paused.", threadID, messageID);
  } else if (command === "clear") {
    userMemory = {};
    return api.sendMessage("🧹 History cleared!", threadID, messageID);
  }
};
