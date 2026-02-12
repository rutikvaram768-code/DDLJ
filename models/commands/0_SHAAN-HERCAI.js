const axios = require("axios");

module.exports.config = {
  name: "hercai",
  version: "2.5.1",
  hasPermission: 0,
  credits: "Shaan Khan", 
  description: "Persistent Multi-Script AI - Optimized for Speed",
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

  // Reply check: Bot ke message par reply hona chahiye
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  api.setMessageReaction("⌛", messageID, () => {}, true);
  api.sendTypingIndicator(threadID);

  const userQuery = body.trim();
  if (!userMemory[senderID]) userMemory[senderID] = [];

  const conversationHistory = userMemory[senderID].join("\n");
  
  const systemPrompt = `You are an AI by Shaan Khan. 
  RULES: Default Roman Urdu. If user asks for another language (Pashto, Urdu script, etc.), switch and stay in that script.
  Context: ${conversationHistory}`;

  // Model ko 'mistral' par set kiya hai kyunki ye 'search' se zyada fast aur stable hai
  const apiURL = `https://text.pollinations.ai/${encodeURIComponent(systemPrompt + "\nUser: " + userQuery)}?model=mistral&seed=${Math.random()}`;

  try {
    const response = await axios.get(apiURL, { 
      timeout: 20000, // 20 seconds timeout
      headers: { 'Content-Type': 'application/json' }
    });

    let botReply = response.data;

    if (!botReply || botReply.trim() === "") {
      throw new Error("Empty response from API");
    }

    // Memory management (Limit to 6 lines for performance)
    userMemory[senderID].push(`U: ${userQuery}`);
    userMemory[senderID].push(`B: ${botReply}`);
    if (userMemory[senderID].length > 6) userMemory[senderID].splice(0, 2);

    api.setMessageReaction("✅", messageID, () => {}, true);
    return api.sendMessage(botReply, threadID, messageID);

  } catch (error) {
    console.error("Hercai Error:", error.message); // Terminal check ke liye
    api.setMessageReaction("❌", messageID, () => {}, true);
    
    let errorMsg = "❌ Server Busy! Dubara koshish karein.";
    if (error.code === 'ECONNABORTED') errorMsg = "❌ Connection Timeout! Internet ya API slow hai.";
    
    return api.sendMessage(errorMsg, threadID, messageID);
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
