module.exports.config = {
	name: "groupemoji",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "RUTIK BABU",
	description: "THIS BOT WAS MADE BY MR RUTIK BABU",
	commandCategory: "CHANGE GROUP EMOJI", 
	usages: "PREFIX", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async function({ api, event, args }) {
	var emoji = args.join(" ")
	if (!emoji) api.sendMessage("BOSS SAATH ME EK EMOJI DALO JO LAGANA HA 😐✌️", event.threadID, event.messageID)
	else api.changeThreadEmoji(emoji, event.threadID, () => api.sendMessage(`BOSS MAINE GROUP KA EMOJI BADAL DIYA 👉 ${emoji}\n━━━━━━━━━━━━━━━━━━━━━━━\nOWNER  𒁍 MR ✮⃝❤≛⃝ 𝐑𝐔𝐓𝐈𝐊──────亗🕊️ BABU 🌺`, event.threadID, event.messageID));
}
