module.exports.config = {
  name: "pry",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAAN",
  description: "Simple Banglish Ai Chatbot",
  commandCategory: "Ai Robot",
  usages: "/meta [typeinBanglish]",
  cooldowns: 2,
  dependencies: {"axios" : ""}
};
module.exports.run = async({api, event, args}) => {

  const axios = require('axios');

if (args.join() == "") { 
    return api.sendMessage(`
     ╭────────────────╮
   🌸𝐄𝐯𝐞𝐫𝐲 𝐇𝐢𝐧𝐝𝐮 𝐈𝐝𝐞𝐧𝐭𝐢𝐭𝐲🌸
     ╰────────────────╯

𝙽𝚊𝚖𝚎                     : 𝐇𝐢𝐧𝐝𝐮.
𝙵𝚊𝚝𝚑𝚎𝚛'𝚜 𝙽𝚊𝚖𝚎    : 𝐀𝐝𝐨𝐦 (A.S:)
𝙲𝚛𝚎𝚊𝚝𝚘𝚛               : 𝐇𝐢𝐧𝐝𝐮
𝙸𝚍𝚎𝚊𝚕                   : 𝐡𝐚𝐫 𝐡𝐚𝐫 𝐦𝐚𝐡𝐚𝐝𝐞𝐯(S.A.W.) 
𝙷𝚘𝚕𝚢 𝙱𝚘𝚘𝚔           : 𝐡𝐢𝐧𝐝𝐮 
𝚁𝚎𝚕𝚒𝚐𝚒𝚘𝚗            : 𝐡𝐢𝐧𝐝𝐮 
𝙸𝚍𝚎𝚗𝚝𝚒𝚝𝚢            : 𝐣𝐚𝐲 𝐬𝐡𝐫𝐞𝐞 𝐫𝐚𝐦
𝙷𝚘𝚋𝚋𝚒𝚎𝚜               : 𝐫𝐚𝐝𝐡𝐞 𝐫𝐚𝐝𝐡𝐞 
𝙿𝚛𝚎𝚜𝚎𝚗𝚝 𝙰𝚍𝚍𝚛𝚎𝚜𝚜   : 𝐃𝐮𝐧𝐢𝐲𝐚 
𝙿𝚎𝚛𝚖𝚊𝚗𝚎𝚗𝚝 𝙰𝚍𝚍𝚛𝚎𝚜𝚜 : 𝐩𝐮𝐧𝐞 (𝐫𝐚𝐝𝐡𝐞 𝐫𝐚𝐝𝐡𝐞) update of 👉༆𝐌𝐑 𝐑𝐔𝐓𝐈𝐊 𝐕𝐀𝐑𝐌𝐀༄👈.`, event.threadID, event.messageID)}

  else {
    let uint = encodeURI(args.join(' '));
  const res = await axios.get(`https://simsimi.info/api/?text=${uint}&lc=bn`);
  var d1 = res.data.message
  return api.sendMessage(`${d1}`, event.threadID, event.messageID)

  }



}