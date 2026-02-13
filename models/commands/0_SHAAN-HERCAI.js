const axios = require("axios");

module.exports.config = {
  name: "hercai",
  version: "2.8.5",
  hasPermission: 0,
  credits: "Shaan Khan", 
  description: "Strict Script Forcer with Stable API Connection",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[Reply to bot]",
  cooldowns: 2,
};

let userMemory = {};
let lastScript = {}; 
let isActive = true;

module.exports.handleEvent = async function ({ api, event }) {
  // Credits check directly from config
  if (this.config.credits !== "Shaan Khan") {
    return api.sendMessage("⚠️ Error: Credits changed. Creator: Shaan Khan", event.threadID, event.messageID);
  }

  const { threadID, messageID, senderID, body, messageReply } = event;
  
  // Bot tabhi trigger hoga jab use reply diya jaye
  if (!isActive || !body || !messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  api.setMessageReaction("⌛", messageID, () => {}, true);

  const userQuery = body.toLowerCase();
  if (!userMemory[senderID]) userMemory[senderID] = [];
  if (!lastScript[senderID]) lastScript[senderID] = "Roman Urdu";

  // Script detection logic
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

  // Prompt logic
  const systemPrompt = `You are an AI by Shaan Khan. Respond in ${lastScript[senderID]}. If script is NATIVE, do NOT use English/Roman letters. Use emojis. Context: ${conversationHistory}`;

  // API URL with stable model
  const apiURL = `https://text.pollinations.ai/${encodeURIComponent(body)}?system=${encodeURIComponent(systemPrompt)}&model=openai&seed=${Math.floor(Math.random() * 1000)}`;

  try {
    const res = await axios.get(apiURL);
    let botReply = res.data;

    if (!botReply || botReply.length < 1) {
       throw new Error("No response from API");
    }

    // Memory update
    userMemory[senderID].push(`U: ${body}`, `B: ${botReply}`);
    if (userMemory[senderID].length > 6) userMemory[senderID].splice(0, 2);

    api.setMessageReaction("✅", messageID, () => {}, true);
    return api.sendMessage(botReply, threadID, messageID);

  } catch (error) {
    console.error("API Error:", error.message);
    api.setMessageReaction("❌", messageID, () => {}, true);
    
    // Backup try with a different model if first fails
    try {
        const backupURL = `https://text.pollinations.ai/${encodeURIComponent(body)}?model=search`;
        const backupRes = await axios.get(backupURL);
        return api.sendMessage(backupRes.data + " ✨", threadID, messageID);
    } catch (e) {
        return api.sendMessage("⚠️ API Server down hai, thodi der baad try karein. ✨", threadID, messageID);
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const command = args[0]?.toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ AI Active!", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ AI Paused.", threadID, messageID);
  } else if (command === "clear") {
    userMemory = {};
    lastScript = {};
    return api.sendMessage("🧹 Memory Cleared!", threadID, messageID);
  }
};
