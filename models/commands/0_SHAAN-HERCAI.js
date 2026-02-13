const axios = require("axios");
const https = require("https");

module.exports.config = {
  name: "hercai",
  version: "7.0.0",
  hasPermission: 0,
  credits: "Shaan Khan", 
  description: "Ultimate Connection Fix - No Pollinations",
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
    return api.sendMessage("⚠️ Error: Credits changed.", event.threadID, event.messageID);
  }

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body || !messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  api.setMessageReaction("⌛", messageID, (err) => {}, true);

  if (!userMemory[senderID]) userMemory[senderID] = [];
  if (!lastScript[senderID]) lastScript[senderID] = "Roman Urdu";

  // Language Detection
  const q = body.toLowerCase();
  if (q.includes("pashto")) lastScript[senderID] = "Pashto (پښتو)";
  else if (q.includes("urdu") && q.includes("mein")) lastScript[senderID] = "Urdu (اردو)";
  else if (q.includes("hindi")) lastScript[senderID] = "Hindi (हिंदी)";

  const systemPrompt = `You are an AI by Shaan Khan. Respond ONLY in ${lastScript[senderID]}. Use emojis. Body: ${body}`;

  // NEW STABLE API ENDPOINT
  const apiURL = `https://api.vyturex.com/ai?prompt=${encodeURIComponent(systemPrompt)}`;

  try {
    const response = await axios.get(apiURL, {
      timeout: 15000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Connection errors bypass karne ke liye
    });

    let botReply = response.data;

    if (!botReply) throw new Error("Empty");

    api.setMessageReaction("✅", messageID, (err) => {}, true);
    return api.sendMessage(botReply + " ✨", threadID, messageID);

  } catch (error) {
    // Agar upar wali API fail ho toh ye Last Global AI (No-Fail)
    try {
      const fallback = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ur&dt=t&q=${encodeURIComponent(body)}`);
      const trans = fallback.data[0][0][0];
      return api.sendMessage(trans + " 🥀 (Auto-Translate Mode)", threadID, messageID);
    } catch (e) {
      api.setMessageReaction("❌", messageID, (err) => {}, true);
      return api.sendMessage("⚠️ Server Error! Shaan Khan se rabta karein. 🥀", threadID, messageID);
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const command = args[0]?.toLowerCase();
  if (command === "on") isActive = true;
  if (command === "off") isActive = false;
  if (command === "clear") { userMemory = {}; lastScript = {}; }
  return api.sendMessage("✨ System Status: " + (isActive ? "Active" : "Paused"), threadID, messageID);
};
