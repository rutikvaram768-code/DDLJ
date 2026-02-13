const axios = require("axios");

module.exports.config = {
  name: "hercai",
  version: "3.5.0",
  hasPermission: 0,
  credits: "Shaan Khan", 
  description: "Pollinations Latest API - New Mistral-Nemo Model",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[Reply to bot]",
  cooldowns: 2,
};

let userMemory = {};
let lastScript = {}; 
let isActive = true;

module.exports.handleEvent = async function ({ api, event }) {
  if (this.config.credits !== "Shaan Khan") {
    return api.sendMessage("⚠️ Error: Credits changed. Creator: Shaan Khan", event.threadID, event.messageID);
  }

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body) return;
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  api.setMessageReaction("⌛", messageID, (err) => {}, true);

  const userQuery = body.toLowerCase();
  if (!userMemory[senderID]) userMemory[senderID] = [];
  if (!lastScript[senderID]) lastScript[senderID] = "Roman Urdu";

  // Language Detection
  if (userQuery.includes("pashto") || userQuery.includes("پښتو")) {
    lastScript[senderID] = "NATIVE PASHTO SCRIPT (پښتو)";
  } else if (userQuery.includes("urdu") && (userQuery.includes("script") || userQuery.includes("mein"))) {
    lastScript[senderID] = "NATIVE URDU SCRIPT (اردو)";
  } else if (userQuery.includes("hindi") || userQuery.includes("हिंदी")) {
    lastScript[senderID] = "NATIVE HINDI SCRIPT (हिंदी)";
  } else if (userQuery.includes("roman")) {
    lastScript[senderID] = "Roman Urdu";
  }

  const conversationHistory = userMemory[senderID].join("\n");

  // Latest System Prompt formatting for Pollinations
  const systemPrompt = `You are an AI by Shaan Khan. Respond in ${lastScript[senderID]}. RULES: Use emojis in every sentence. If script is native, strictly avoid English letters. History: ${conversationHistory}`;

  // NEW POLLINATIONS ENDPOINT (Using Mistral-Nemo for stability)
  const apiURL = `https://text.pollinations.ai/${encodeURIComponent(body)}?system=${encodeURIComponent(systemPrompt)}&model=mistral-nemo&seed=${Math.floor(Math.random() * 1000000)}&no-cache=true`;

  try {
    const response = await axios.get(apiURL, { timeout: 15000 });
    let botReply = response.data;

    if (!botReply) throw new Error("Empty response");

    userMemory[senderID].push(`U: ${body}`, `B: ${botReply}`);
    if (userMemory[senderID].length > 6) userMemory[senderID].splice(0, 2);

    api.setMessageReaction("✅", messageID, (err) => {}, true);
    return api.sendMessage(botReply, threadID, messageID);

  } catch (error) {
    console.error("Pollinations API Error:", error.message);
    api.setMessageReaction("❌", messageID, (err) => {}, true);
    
    // Backup Fallback Model (Search) if Nemo fails
    try {
      const fallbackURL = `https://text.pollinations.ai/${encodeURIComponent(body)}?model=search`;
      const fallbackRes = await axios.get(fallbackURL);
      return api.sendMessage(fallbackRes.data + " ✨ (Backup Mode)", threadID, messageID);
    } catch (e) {
      return api.sendMessage("❌ Connection Error! Pollinations API down hai ya slow hai. ✨", threadID, messageID);
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const command = args[0]?.toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ New API Active! Script and Emojis On. 🎭", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ AI Off.", threadID, messageID);
  } else if (command === "clear") {
    userMemory = {};
    lastScript = {};
    return api.sendMessage("🧹 Memory Reset!", threadID, messageID);
  }
};
