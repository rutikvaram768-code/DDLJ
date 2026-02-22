const fs = require("fs");
module.exports.config = {
  name: "SHAAN",
    version: "2.1.1",
  hasPermssion: 0,
  credits: "𝐒𝐇𝐀𝐀𝐍 𝐊𝐇𝐀𝐍", 
  description: "Just Respond",
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = async ({ api, event, Users, Currencies, args, utils, client, global }) => {
  var name = await Users.getNameUser(event.senderID);
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("Rutik varma") ||
     react.includes("rutik varma") || react.includes("Rutik") || react.includes("Rutik") ||
react.includes("rutik") ||
react.includes("Rutik varma") ||     
react.includes("rutik")) {
    var msg = {
        body: `${name} 𝐘𝐀𝐑 ⎯⃛〬𓆩❤️𓆪꯭ ⤹³♡︎𝐑𝐔𝐓𝐈𝐊ː͢ ꯭𓆩❤️𓆪⎯⃛〬 𝐊𝐎 𝐌𝐄𝐍𝐓𝐈𝐎𝐍 𝐍𝐀 𝐊𝐀𝐑𝐎 𝐌𝐔𝐉𝐇𝐄 𝐒𝐇𝐀𝐑𝐀𝐌 𝐀𝐀𝐓𝐈 𝐇𝐀𝐈🙈🙈🙈`,attachment: fs.https://www.facebook.com/share/p/1C2F1qBfZB/(__dirname + `/noprefix//1711811285337.jpg`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💋", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = async ({ api, event, Currencies, args, utils, client, global }) => {

  }